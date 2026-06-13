import type { AppRouter } from '@tickets-project/api/routers/index'
import type { inferRouterOutputs } from '@trpc/server'

type RouterOutputs = inferRouterOutputs<AppRouter>

export type TicketRecord = RouterOutputs['tickets']['list'][number]
export type TicketDetailRecord = RouterOutputs['tickets']['byId']
