import { z } from 'zod'

export const ticketCategoryValues = [
	'TECHNICAL_ISSUE',
	'BILLING',
	'ACCOUNT_ACCESS',
	'PRODUCT_QUESTION',
	'FEATURE_REQUEST',
	'OTHER'
] as const

export const ticketPriorityValues = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const

export const ticketStatusValues = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const

export const contactPreferenceValues = ['EMAIL', 'PHONE_CALL', 'VIDEO_CALL', 'NO_PREFERENCE'] as const

export type TicketCategoryValue = (typeof ticketCategoryValues)[number]
export type TicketPriorityValue = (typeof ticketPriorityValues)[number]
export type TicketStatusValue = (typeof ticketStatusValues)[number]
export type ContactPreferenceValue = (typeof contactPreferenceValues)[number]

export const ticketCategoryLabels: Record<TicketCategoryValue, string> = {
	TECHNICAL_ISSUE: 'Technical Issue',
	BILLING: 'Billing',
	ACCOUNT_ACCESS: 'Account Access',
	PRODUCT_QUESTION: 'Product Question',
	FEATURE_REQUEST: 'Feature Request',
	OTHER: 'Other'
}

export const ticketPriorityLabels: Record<TicketPriorityValue, string> = {
	LOW: 'Low',
	NORMAL: 'Normal',
	HIGH: 'High',
	URGENT: 'Urgent'
}

export const ticketStatusLabels: Record<TicketStatusValue, string> = {
	OPEN: 'Open',
	IN_PROGRESS: 'In Progress',
	RESOLVED: 'Resolved',
	CLOSED: 'Closed'
}

export const contactPreferenceLabels: Record<ContactPreferenceValue, string> = {
	EMAIL: 'Email',
	PHONE_CALL: 'Phone call',
	VIDEO_CALL: 'Video call',
	NO_PREFERENCE: 'No preference'
}

export const ticketCategorySchema = z.enum(ticketCategoryValues)
export const ticketPrioritySchema = z.enum(ticketPriorityValues)
export const ticketStatusSchema = z.enum(ticketStatusValues)
export const contactPreferenceSchema = z.enum(contactPreferenceValues)
