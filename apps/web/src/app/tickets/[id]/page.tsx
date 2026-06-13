import { notFound } from 'next/navigation'
import { TicketDetail } from '@/components/tickets/ticket-detail'
import type { TicketDetailRecord } from '@/components/tickets/ticket-types'
import { createServerTrpcClient, requireServerRole } from '@/lib/server-trpc'

export default async function CustomerTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	// auth guard
	await requireServerRole('CUSTOMER')

	// ticket access guard
	const trpc = await createServerTrpcClient()
	let ticket: TicketDetailRecord

	try {
		ticket = await trpc.tickets.byId.query({ id })
	} catch {
		notFound()
	}

	return <TicketDetail id={id} initialTicket={ticket} />
}
