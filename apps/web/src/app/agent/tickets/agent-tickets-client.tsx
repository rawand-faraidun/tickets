'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { emptyTicketFilters, TicketFilters } from '@/components/tickets/ticket-filters'
import { TicketShell } from '@/components/tickets/ticket-shell'
import { TicketTable } from '@/components/tickets/ticket-table'
import type { TicketRecord } from '@/components/tickets/ticket-types'
import { trpc } from '@/utils/trpc'

export default function AgentTicketsClient({ initialTickets }: { initialTickets: TicketRecord[] }) {
	const [filters, setFilters] = useState(emptyTicketFilters('ACTIVE'))
	const isDefaultFilters =
		filters.status === 'ACTIVE' && !filters.search && !filters.category && !filters.priority && !filters.bookedDate

	// api
	const tickets = useQuery(
		trpc.tickets.list.queryOptions(
			{
				search: filters.search || undefined,
				status: filters.status || undefined,
				category: filters.category || undefined,
				priority: filters.priority || undefined,
				bookedDate: filters.bookedDate || undefined
			},
			isDefaultFilters ? { initialData: initialTickets } : undefined
		)
	)

	return (
		<TicketShell
			title="Ticket Queue"
			subtitle="Prioritize urgent tickets and upcoming appointments."
			navTitle="Agent Console"
			navItems={[{ href: '/agent/tickets', label: 'Queue', active: true }]}
		>
			{/* filters */}
			<TicketFilters value={filters} onChange={setFilters} agent />
			{tickets.isLoading ? (
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Loader2 className="size-4 animate-spin" />
					Loading queue...
				</div>
			) : (
				<TicketTable tickets={(tickets.data ?? []) as TicketRecord[]} agent />
			)}
		</TicketShell>
	)
}
