import {
	type ContactPreferenceValue,
	contactPreferenceLabels,
	type TicketCategoryValue,
	type TicketPriorityValue,
	type TicketStatusValue,
	ticketCategoryLabels,
	ticketPriorityLabels,
	ticketStatusLabels
} from '@tickets-project/api/ticket-options'

export type TicketDate = Date | string | null

export function formatDateTime(value: TicketDate) {
	if (!value) {
		return 'Not booked'
	}

	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}).format(new Date(value))
}

export function formatShortDate(value: TicketDate) {
	if (!value) {
		return 'Not booked'
	}

	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(value))
}

export function statusLabel(status: TicketStatusValue) {
	return ticketStatusLabels[status]
}

export function priorityLabel(priority: TicketPriorityValue) {
	return ticketPriorityLabels[priority]
}

export function categoryLabel(category: TicketCategoryValue) {
	return ticketCategoryLabels[category]
}

export function contactPreferenceLabel(value: ContactPreferenceValue) {
	return contactPreferenceLabels[value]
}
