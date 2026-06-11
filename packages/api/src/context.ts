import { auth } from '@tickets-project/auth'
import prisma from '@tickets-project/db'
import type { Context as HonoContext } from 'hono'

export type CreateContextOptions = {
	context: HonoContext
}

export async function createContext({ context }: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers
	})
	const user = session?.user
		? await prisma.user.findUnique({
				where: { id: session.user.id },
				select: {
					id: true,
					name: true,
					email: true,
					role: true
				}
			})
		: null

	return {
		auth: null,
		session,
		user,
		prisma
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
