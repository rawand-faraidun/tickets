import { randomUUID } from 'node:crypto'
import type { Prisma, PrismaClient } from '@tickets-project/db'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { agentProcedure, protectedProcedure, router } from '../index'
import {
	contactPreferenceSchema,
	ticketCategorySchema,
	ticketPrioritySchema,
	ticketStatusSchema
} from '../ticket-options'

const ticketInclude = {
	customer: {
		select: {
			id: true,
			name: true,
			email: true
		}
	},
	comments: {
		orderBy: {
			createdAt: 'asc'
		},
		include: {
			author: {
				select: {
					id: true,
					name: true,
					email: true,
					role: true
				}
			}
		}
	}
} satisfies Prisma.TicketInclude

const listTicketsInput = z
	.object({
		search: z.string().trim().optional(),
		status: z.union([ticketStatusSchema, z.literal('ACTIVE')]).optional(),
		category: ticketCategorySchema.optional(),
		priority: ticketPrioritySchema.optional(),
		bookedDate: z.string().trim().optional()
	})
	.optional()

const createTicketInput = z.object({
	title: z.string().trim().min(3, 'Title must be at least 3 characters'),
	description: z.string().trim().min(10, 'Description must be at least 10 characters'),
	category: ticketCategorySchema,
	priority: ticketPrioritySchema,
	bookedAt: z.string().datetime().nullable().optional(),
	contactPreference: contactPreferenceSchema
})

const addCommentInput = z.object({
	id: z.string().min(1),
	body: z.string().trim().min(2, 'Comment must be at least 2 characters')
})

const updateStatusInput = z.object({
	id: z.string().min(1),
	status: ticketStatusSchema
})

function bookedDateRange(bookedDate?: string) {
	if (!bookedDate) {
		return null
	}

	const start = new Date(`${bookedDate}T00:00:00.000Z`)
	if (Number.isNaN(start.getTime())) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'Booked date must use YYYY-MM-DD format'
		})
	}

	const end = new Date(start)
	end.setUTCDate(end.getUTCDate() + 1)

	return { start, end }
}

async function nextTicketNumber(prisma: PrismaClient) {
	const tickets = await prisma.ticket.findMany({
		select: { ticketNumber: true }
	})
	const maxNumber = tickets.reduce((max, ticket) => {
		const parsed = Number.parseInt(ticket.ticketNumber.replace(/^HD-/, ''), 10)
		return Number.isNaN(parsed) ? max : Math.max(max, parsed)
	}, 1000)

	return `HD-${maxNumber + 1}`
}

async function findTicketForUser(prisma: PrismaClient, id: string, user: { id: string; role: 'CUSTOMER' | 'AGENT' }) {
	const ticket = await prisma.ticket.findFirst({
		where: {
			OR: [{ id }, { ticketNumber: id }]
		},
		include: ticketInclude
	})

	if (!ticket) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'Ticket not found'
		})
	}

	if (user.role === 'CUSTOMER' && ticket.customerId !== user.id) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'You can only access your own tickets'
		})
	}

	return ticket
}

export const ticketsRouter = router({
	list: protectedProcedure.input(listTicketsInput).query(async ({ ctx, input }) => {
		const conditions: Prisma.TicketWhereInput[] = []

		// role scope
		if (ctx.user.role === 'CUSTOMER') {
			conditions.push({ customerId: ctx.user.id })
		}

		if (input?.status === 'ACTIVE') {
			conditions.push({ status: { in: ['OPEN', 'IN_PROGRESS'] } })
		} else if (input?.status) {
			conditions.push({ status: input.status })
		}

		if (input?.category) {
			conditions.push({ category: input.category })
		}

		if (input?.priority) {
			conditions.push({ priority: input.priority })
		}

		const range = bookedDateRange(input?.bookedDate)
		if (range) {
			conditions.push({
				bookedAt: {
					gte: range.start,
					lt: range.end
				}
			})
		}

		const search = input?.search?.trim()
		if (search) {
			conditions.push({
				OR: [
					{ ticketNumber: { contains: search } },
					{ title: { contains: search } },
					{ description: { contains: search } },
					{ customer: { name: { contains: search } } },
					{ comments: { some: { body: { contains: search } } } }
				]
			})
		}

		return ctx.prisma.ticket.findMany({
			where: conditions.length ? { AND: conditions } : undefined,
			include: {
				customer: ticketInclude.customer,
				comments: {
					orderBy: {
						createdAt: 'desc'
					},
					take: 1,
					include: ticketInclude.comments.include
				}
			},
			orderBy: [
				{
					priority: 'desc'
				},
				{
					updatedAt: 'desc'
				}
			]
		})
	}),

	byId: protectedProcedure.input(z.object({ id: z.string().min(1) })).query(({ ctx, input }) => {
		return findTicketForUser(ctx.prisma, input.id, ctx.user)
	}),

	create: protectedProcedure.input(createTicketInput).mutation(async ({ ctx, input }) => {
		// role guard
		if (ctx.user.role !== 'CUSTOMER') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Only customers can create tickets'
			})
		}

		return ctx.prisma.ticket.create({
			data: {
				id: randomUUID(),
				ticketNumber: await nextTicketNumber(ctx.prisma),
				title: input.title,
				description: input.description,
				category: input.category,
				priority: input.priority,
				status: 'OPEN',
				customerId: ctx.user.id,
				bookedAt: input.bookedAt ? new Date(input.bookedAt) : null,
				contactPreference: input.contactPreference,
				comments: {
					create: {
						id: randomUUID(),
						authorId: ctx.user.id,
						body: input.description
					}
				}
			},
			include: ticketInclude
		})
	}),

	addComment: protectedProcedure.input(addCommentInput).mutation(async ({ ctx, input }) => {
		const ticket = await findTicketForUser(ctx.prisma, input.id, ctx.user)

		return ctx.prisma.ticketComment.create({
			data: {
				id: randomUUID(),
				ticketId: ticket.id,
				authorId: ctx.user.id,
				body: input.body
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true
					}
				}
			}
		})
	}),

	updateStatus: agentProcedure.input(updateStatusInput).mutation(async ({ ctx, input }) => {
		const ticket = await findTicketForUser(ctx.prisma, input.id, ctx.user)

		return ctx.prisma.ticket.update({
			where: { id: ticket.id },
			data: { status: input.status },
			include: ticketInclude
		})
	})
})
