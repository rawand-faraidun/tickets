import prisma from '@tickets-project/db'
import { hashPassword } from 'better-auth/crypto'

const demoPassword = 'Password123!'

const users = [
	{
		id: 'customer-sarah',
		name: 'Sarah Customer',
		email: 'sarah.customer@example.com',
		role: 'CUSTOMER'
	},
	{
		id: 'customer-ali',
		name: 'Ali Customer',
		email: 'ali.customer@example.com',
		role: 'CUSTOMER'
	},
	{
		id: 'customer-maya',
		name: 'Maya Customer',
		email: 'maya.customer@example.com',
		role: 'CUSTOMER'
	},
	{
		id: 'agent-omar',
		name: 'Omar Agent',
		email: 'omar.agent@example.com',
		role: 'AGENT'
	}
] as const

const ticketSeeds = [
	{
		id: 'ticket-hd-1024',
		ticketNumber: 'HD-1024',
		title: 'VPN disconnects every hour',
		description: 'I lose connection every hour while working remotely. Reconnecting fixes it for a short time.',
		category: 'TECHNICAL_ISSUE',
		priority: 'HIGH',
		status: 'IN_PROGRESS',
		customerId: 'customer-sarah',
		bookedAt: new Date('2026-06-10T10:30:00.000Z'),
		contactPreference: 'VIDEO_CALL',
		createdAt: new Date('2026-06-07T09:14:00.000Z'),
		comments: [
			{
				id: 'comment-hd-1024-1',
				authorId: 'customer-sarah',
				body: 'I lose connection every hour while working remotely. Reconnecting fixes it for a short time.',
				createdAt: new Date('2026-06-07T09:14:00.000Z')
			},
			{
				id: 'comment-hd-1024-2',
				authorId: 'agent-omar',
				body: 'I am checking the VPN logs. Please confirm whether this happens on another network.',
				createdAt: new Date('2026-06-07T10:05:00.000Z')
			}
		]
	},
	{
		id: 'ticket-hd-1023',
		ticketNumber: 'HD-1023',
		title: 'Payment method fails',
		description: 'The billing page rejects my saved card even though the bank approved it.',
		category: 'BILLING',
		priority: 'URGENT',
		status: 'OPEN',
		customerId: 'customer-ali',
		bookedAt: new Date('2026-06-09T09:00:00.000Z'),
		contactPreference: 'PHONE_CALL',
		createdAt: new Date('2026-06-08T08:25:00.000Z'),
		comments: [
			{
				id: 'comment-hd-1023-1',
				authorId: 'customer-ali',
				body: 'The billing page rejects my saved card even though the bank approved it.',
				createdAt: new Date('2026-06-08T08:25:00.000Z')
			}
		]
	},
	{
		id: 'ticket-hd-1022',
		ticketNumber: 'HD-1022',
		title: 'Question about monthly usage',
		description: 'Can you explain how the monthly usage total is calculated?',
		category: 'PRODUCT_QUESTION',
		priority: 'NORMAL',
		status: 'OPEN',
		customerId: 'customer-maya',
		bookedAt: null,
		contactPreference: 'EMAIL',
		createdAt: new Date('2026-06-08T11:40:00.000Z'),
		comments: [
			{
				id: 'comment-hd-1022-1',
				authorId: 'customer-maya',
				body: 'Can you explain how the monthly usage total is calculated?',
				createdAt: new Date('2026-06-08T11:40:00.000Z')
			}
		]
	},
	{
		id: 'ticket-hd-1019',
		ticketNumber: 'HD-1019',
		title: 'Need invoice copy',
		description: 'Please send a PDF copy of my last invoice.',
		category: 'BILLING',
		priority: 'NORMAL',
		status: 'RESOLVED',
		customerId: 'customer-sarah',
		bookedAt: null,
		contactPreference: 'EMAIL',
		createdAt: new Date('2026-06-05T12:15:00.000Z'),
		comments: [
			{
				id: 'comment-hd-1019-1',
				authorId: 'customer-sarah',
				body: 'Please send a PDF copy of my last invoice.',
				createdAt: new Date('2026-06-05T12:15:00.000Z')
			},
			{
				id: 'comment-hd-1019-2',
				authorId: 'agent-omar',
				body: 'I sent the invoice PDF to your account email and marked this as resolved.',
				createdAt: new Date('2026-06-05T13:05:00.000Z')
			}
		]
	},
	{
		id: 'ticket-hd-1012',
		ticketNumber: 'HD-1012',
		title: 'Cannot reset password',
		description: 'The reset email never arrives, and I need access before my appointment.',
		category: 'ACCOUNT_ACCESS',
		priority: 'URGENT',
		status: 'CLOSED',
		customerId: 'customer-sarah',
		bookedAt: new Date('2026-06-12T14:00:00.000Z'),
		contactPreference: 'EMAIL',
		createdAt: new Date('2026-06-03T14:25:00.000Z'),
		comments: [
			{
				id: 'comment-hd-1012-1',
				authorId: 'customer-sarah',
				body: 'The reset email never arrives, and I need access before my appointment.',
				createdAt: new Date('2026-06-03T14:25:00.000Z')
			},
			{
				id: 'comment-hd-1012-2',
				authorId: 'agent-omar',
				body: 'We confirmed the account email and completed the reset manually.',
				createdAt: new Date('2026-06-03T15:10:00.000Z')
			}
		]
	}
] as const

async function seed() {
	const passwordHash = await hashPassword(demoPassword)

	for (const user of users) {
		await prisma.user.upsert({
			where: { email: user.email },
			update: {
				name: user.name,
				role: user.role,
				emailVerified: true
			},
			create: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				emailVerified: true
			}
		})

		await prisma.account.upsert({
			where: { id: `account-${user.id}` },
			update: {
				accountId: user.id,
				providerId: 'credential',
				password: passwordHash,
				userId: user.id
			},
			create: {
				id: `account-${user.id}`,
				accountId: user.id,
				providerId: 'credential',
				password: passwordHash,
				userId: user.id
			}
		})
	}

	await prisma.ticketComment.deleteMany({
		where: {
			ticketId: {
				in: ticketSeeds.map(ticket => ticket.id)
			}
		}
	})
	await prisma.ticket.deleteMany({
		where: {
			id: {
				in: ticketSeeds.map(ticket => ticket.id)
			}
		}
	})

	for (const ticket of ticketSeeds) {
		await prisma.ticket.create({
			data: {
				id: ticket.id,
				ticketNumber: ticket.ticketNumber,
				title: ticket.title,
				description: ticket.description,
				category: ticket.category,
				priority: ticket.priority,
				status: ticket.status,
				customerId: ticket.customerId,
				bookedAt: ticket.bookedAt,
				contactPreference: ticket.contactPreference,
				createdAt: ticket.createdAt,
				comments: {
					create: ticket.comments.map(comment => ({
						id: comment.id,
						authorId: comment.authorId,
						body: comment.body,
						createdAt: comment.createdAt
					}))
				}
			}
		})
	}
}

seed()
	.catch((_error: unknown) => {
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
