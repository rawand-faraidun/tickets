import type { TicketRecord } from '@/components/tickets/ticket-types'
import { createServerTrpcClient, requireServerRole } from '@/lib/server-trpc'
import AgentTicketsClient from './agent-tickets-client'

export default async function AgentTicketsPage() {
	// auth guard
	await requireServerRole('AGENT')

	// api
	const trpc = await createServerTrpcClient()
	const tickets = await trpc.tickets.list.query({ status: 'ACTIVE' })

	return <AgentTicketsClient initialTickets={tickets as TicketRecord[]} />
}
