'use client'

import {
	ticketCategoryLabels,
	ticketCategoryValues,
	ticketPriorityLabels,
	ticketPriorityValues,
	ticketStatusLabels,
	ticketStatusValues
} from '@tickets-project/api/ticket-options'
import { Input } from '@tickets-project/ui/components/input'

export type TicketFiltersValue = {
	search: string
	status: '' | 'ACTIVE' | (typeof ticketStatusValues)[number]
	category: '' | (typeof ticketCategoryValues)[number]
	priority: '' | (typeof ticketPriorityValues)[number]
	bookedDate: string
}

export function emptyTicketFilters(status: TicketFiltersValue['status'] = ''): TicketFiltersValue {
	return {
		search: '',
		status,
		category: '',
		priority: '',
		bookedDate: ''
	}
}

export function TicketFilters({
	value,
	onChange,
	agent
}: {
	value: TicketFiltersValue
	onChange: (value: TicketFiltersValue) => void
	agent?: boolean
}) {
	return (
		<div className="mb-4 grid gap-2 md:grid-cols-2 xl:grid-cols-[1.5fr_repeat(4,minmax(120px,1fr))]">
			<Input
				aria-label={agent ? 'Search queue' : 'Search tickets'}
				placeholder={agent ? 'Search number, customer, title, or text' : 'Search tickets'}
				value={value.search}
				onChange={event => onChange({ ...value, search: event.target.value })}
			/>
			<select
				aria-label="Status filter"
				className="h-8 rounded-none border border-input bg-background px-2 text-xs"
				value={value.status}
				onChange={event =>
					onChange({
						...value,
						status: event.target.value as TicketFiltersValue['status']
					})
				}
			>
				<option value="">{agent ? 'All statuses' : 'All statuses'}</option>
				{agent ? <option value="ACTIVE">Open + active</option> : null}
				{ticketStatusValues.map(status => (
					<option key={status} value={status}>
						{ticketStatusLabels[status]}
					</option>
				))}
			</select>
			<select
				aria-label="Category filter"
				className="h-8 rounded-none border border-input bg-background px-2 text-xs"
				value={value.category}
				onChange={event =>
					onChange({
						...value,
						category: event.target.value as TicketFiltersValue['category']
					})
				}
			>
				<option value="">All categories</option>
				{ticketCategoryValues.map(category => (
					<option key={category} value={category}>
						{ticketCategoryLabels[category]}
					</option>
				))}
			</select>
			<select
				aria-label="Priority filter"
				className="h-8 rounded-none border border-input bg-background px-2 text-xs"
				value={value.priority}
				onChange={event =>
					onChange({
						...value,
						priority: event.target.value as TicketFiltersValue['priority']
					})
				}
			>
				<option value="">All priorities</option>
				{ticketPriorityValues.map(priority => (
					<option key={priority} value={priority}>
						{ticketPriorityLabels[priority]}
					</option>
				))}
			</select>
			<Input
				aria-label="Booked date filter"
				type="date"
				value={value.bookedDate}
				onChange={event => onChange({ ...value, bookedDate: event.target.value })}
			/>
		</div>
	)
}
