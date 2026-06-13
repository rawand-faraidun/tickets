import { buttonVariants } from '@tickets-project/ui/components/button'
import { PriorityBadge, StatusBadge } from './ticket-badges'
import { categoryLabel, formatDateTime, formatShortDate } from './ticket-format'
import type { TicketRecord } from './ticket-types'

export function TicketTable({ tickets, agent }: { tickets: TicketRecord[]; agent?: boolean }) {
	if (tickets.length === 0) {
		return (
			<div className="rounded-md border border-dashed p-8 text-center">
				<h2 className="font-medium text-sm">No tickets found</h2>
				<p className="mt-1 text-muted-foreground text-sm">Adjust filters or create a new ticket.</p>
			</div>
		)
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<table className="w-full text-left text-sm">
				<thead className="hidden bg-muted/50 text-muted-foreground text-xs uppercase md:table-header-group">
					<tr>
						<th className="px-3 py-3">Ticket</th>
						{agent ? <th className="px-3 py-3">Customer</th> : null}
						<th className="px-3 py-3">Category</th>
						<th className="px-3 py-3">Status</th>
						<th className="px-3 py-3">Priority</th>
						<th className="px-3 py-3">Booked</th>
						<th className="px-3 py-3">Updated</th>
						<th className="px-3 py-3">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y">
					{tickets.map(ticket => (
						<tr key={ticket.id} className="grid gap-2 p-3 md:table-row md:p-0">
							<td className="md:px-3 md:py-3">
								<div className="font-medium">{ticket.ticketNumber}</div>
								<div className="text-muted-foreground text-sm">{ticket.title}</div>
							</td>
							{agent ? (
								<td className="text-sm md:px-3 md:py-3">
									<span className="md:hidden">Customer: </span>
									{ticket.customer.name}
								</td>
							) : null}
							<td className="text-sm md:px-3 md:py-3">
								<span className="md:hidden">Category: </span>
								{categoryLabel(ticket.category)}
							</td>
							<td className="md:px-3 md:py-3">
								<StatusBadge status={ticket.status} />
							</td>
							<td className="md:px-3 md:py-3">
								<PriorityBadge priority={ticket.priority} />
							</td>
							<td className="text-sm md:px-3 md:py-3">{formatDateTime(ticket.bookedAt)}</td>
							<td className="text-sm md:px-3 md:py-3">{formatShortDate(ticket.updatedAt)}</td>
							<td className="md:px-3 md:py-3">
								<a
									className={buttonVariants({ variant: 'outline', size: 'sm' })}
									href={agent ? `/agent/tickets/${ticket.id}` : `/tickets/${ticket.id}`}
								>
									Open
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
