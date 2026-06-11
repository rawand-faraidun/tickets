import { protectedProcedure, publicProcedure, router } from '../index'
import { ticketsRouter } from './tickets'

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return 'OK'
	}),
	me: protectedProcedure.query(({ ctx }) => {
		return {
			sessionUser: ctx.session.user,
			user: ctx.user
		}
	}),
	tickets: ticketsRouter
})
export type AppRouter = typeof appRouter
