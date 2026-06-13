import type { TicketRecord } from '@/components/tickets/ticket-types'
import { createServerTrpcClient, requireServerRole } from '@/lib/server-trpc'
import CustomerTicketsClient from './tickets-client'

export default async function CustomerTicketsPage() {
	// auth guard
	await requireServerRole('CUSTOMER')

	// api
	const trpc = await createServerTrpcClient()
	const tickets = await trpc.tickets.list.query({})

	return <CustomerTicketsClient initialTickets={tickets as TicketRecord[]} />
}
