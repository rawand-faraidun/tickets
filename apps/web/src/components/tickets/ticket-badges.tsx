import { cn } from '@tickets-project/ui/lib/utils'
import { priorityLabel, statusLabel } from './ticket-format'
import type { TicketRecord } from './ticket-types'

export function StatusBadge({ status }: { status: TicketRecord['status'] }) {
	return (
		<span
			className={cn(
				'inline-flex min-h-6 items-center rounded-full px-2 font-medium text-xs',
				status === 'OPEN' && 'bg-blue-100 text-blue-700',
				status === 'IN_PROGRESS' && 'bg-amber-100 text-amber-700',
				status === 'RESOLVED' && 'bg-green-100 text-green-700',
				status === 'CLOSED' && 'bg-slate-200 text-slate-700'
			)}
		>
			{statusLabel(status)}
		</span>
	)
}

export function PriorityBadge({ priority }: { priority: TicketRecord['priority'] }) {
	return (
		<span
			className={cn(
				'inline-flex min-h-6 items-center rounded-full px-2 font-medium text-xs',
				priority === 'URGENT' && 'bg-red-100 text-red-700',
				priority === 'HIGH' && 'bg-amber-100 text-amber-700',
				priority === 'NORMAL' && 'bg-slate-100 text-slate-700',
				priority === 'LOW' && 'bg-teal-50 text-teal-700'
			)}
		>
			{priorityLabel(priority)}
		</span>
	)
}
