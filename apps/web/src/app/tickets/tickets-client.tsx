'use client'

import { useQuery } from '@tanstack/react-query'
import { buttonVariants } from '@tickets-project/ui/components/button'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { emptyTicketFilters, TicketFilters } from '@/components/tickets/ticket-filters'
import { TicketShell } from '@/components/tickets/ticket-shell'
import { TicketTable } from '@/components/tickets/ticket-table'
import type { TicketRecord } from '@/components/tickets/ticket-types'
import { trpc } from '@/utils/trpc'

export default function CustomerTicketsClient({ initialTickets }: { initialTickets: TicketRecord[] }) {
	const [filters, setFilters] = useState(emptyTicketFilters())
	const isDefaultFilters = Object.values(filters).every(value => !value)

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
			title="My Tickets"
			subtitle="Track requests, appointments, status changes, and replies."
			navTitle="Customer Portal"
			navItems={[
				{ href: '/tickets', label: 'My Tickets', active: true },
				{ href: '/tickets/new', label: 'Create Ticket' }
			]}
			action={
				<Link className={buttonVariants()} href="/tickets/new">
					<Plus />
					New Ticket
				</Link>
			}
		>
			{/* filters */}
			<TicketFilters value={filters} onChange={setFilters} />
			{tickets.isLoading ? (
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Loader2 className="size-4 animate-spin" />
					Loading tickets...
				</div>
			) : (
				<TicketTable tickets={(tickets.data ?? []) as TicketRecord[]} />
			)}
		</TicketShell>
	)
}
