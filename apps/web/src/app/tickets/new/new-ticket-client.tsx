'use client'

import { useMutation } from '@tanstack/react-query'
import {
	type ContactPreferenceValue,
	contactPreferenceLabels,
	contactPreferenceValues,
	type TicketCategoryValue,
	type TicketPriorityValue,
	ticketCategoryLabels,
	ticketCategoryValues,
	ticketPriorityLabels,
	ticketPriorityValues
} from '@tickets-project/api/ticket-options'
import { Button } from '@tickets-project/ui/components/button'
import { Input } from '@tickets-project/ui/components/input'
import { Label } from '@tickets-project/ui/components/label'
import { Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { TicketShell } from '@/components/tickets/ticket-shell'
import { queryClient, trpc } from '@/utils/trpc'

type FormState = {
	title: string
	description: string
	category: TicketCategoryValue
	priority: TicketPriorityValue
	bookedAt: string
	contactPreference: ContactPreferenceValue
}

const initialForm: FormState = {
	title: '',
	description: '',
	category: 'TECHNICAL_ISSUE',
	priority: 'NORMAL',
	bookedAt: '',
	contactPreference: 'EMAIL'
}

export default function NewTicketClient() {
	const router = useRouter()
	const [form, setForm] = useState(initialForm)
	const [submitted, setSubmitted] = useState(false)

	// api
	const createTicket = useMutation(
		trpc.tickets.create.mutationOptions({
			onSuccess: async ticket => {
				await queryClient.invalidateQueries()
				toast.success(`Created ${ticket.ticketNumber}`)
				router.push(`/tickets/${ticket.id}`)
			}
		})
	)

	const errors = {
		title: form.title.trim().length < 3 ? 'Title must be at least 3 characters.' : '',
		description: form.description.trim().length < 10 ? 'Description must be at least 10 characters.' : ''
	}
	const hasErrors = Boolean(errors.title || errors.description)

	return (
		<TicketShell
			title="Create Ticket"
			subtitle="Capture enough information for support to triage quickly."
			navTitle="Customer Portal"
			navItems={[
				{ href: '/tickets', label: 'My Tickets' },
				{ href: '/tickets/new', label: 'Create Ticket', active: true }
			]}
		>
			{/* form */}
			<form
				className="grid gap-4"
				onSubmit={event => {
					// form submit handler
					event.preventDefault()
					setSubmitted(true)

					if (hasErrors) {
						return
					}

					createTicket.mutate({
						title: form.title,
						description: form.description,
						category: form.category,
						priority: form.priority,
						bookedAt: form.bookedAt ? new Date(form.bookedAt).toISOString() : null,
						contactPreference: form.contactPreference
					})
				}}
			>
				<div className="grid gap-4 md:grid-cols-2">
					<Field label="Title" error={submitted ? errors.title : ''} className="md:col-span-2">
						<Input
							value={form.title}
							onChange={event => setForm({ ...form, title: event.target.value })}
							placeholder="VPN disconnects every hour"
						/>
					</Field>
					<Field label="Description" error={submitted ? errors.description : ''} className="md:col-span-2">
						<textarea
							className="min-h-32 rounded-none border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
							value={form.description}
							onChange={event => setForm({ ...form, description: event.target.value })}
							placeholder="Describe the issue and what you already tried."
						/>
					</Field>
					<Field label="Category">
						<select
							className="h-9 rounded-none border border-input bg-background px-2 text-sm"
							value={form.category}
							onChange={event =>
								setForm({
									...form,
									category: event.target.value as TicketCategoryValue
								})
							}
						>
							{ticketCategoryValues.map(category => (
								<option key={category} value={category}>
									{ticketCategoryLabels[category]}
								</option>
							))}
						</select>
					</Field>
					<Field label="Priority">
						<select
							className="h-9 rounded-none border border-input bg-background px-2 text-sm"
							value={form.priority}
							onChange={event =>
								setForm({
									...form,
									priority: event.target.value as TicketPriorityValue
								})
							}
						>
							{ticketPriorityValues.map(priority => (
								<option key={priority} value={priority}>
									{ticketPriorityLabels[priority]}
								</option>
							))}
						</select>
					</Field>
					<Field label="Book support date and time">
						<Input
							type="datetime-local"
							value={form.bookedAt}
							onChange={event => setForm({ ...form, bookedAt: event.target.value })}
						/>
					</Field>
					<Field label="Contact preference">
						<select
							className="h-9 rounded-none border border-input bg-background px-2 text-sm"
							value={form.contactPreference}
							onChange={event =>
								setForm({
									...form,
									contactPreference: event.target.value as ContactPreferenceValue
								})
							}
						>
							{contactPreferenceValues.map(preference => (
								<option key={preference} value={preference}>
									{contactPreferenceLabels[preference]}
								</option>
							))}
						</select>
					</Field>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button type="submit" disabled={createTicket.isPending}>
						{createTicket.isPending ? <Loader2 className="animate-spin" /> : <Save />}
						Submit Ticket
					</Button>
					<Button type="button" variant="outline" onClick={() => router.push('/tickets')}>
						Cancel
					</Button>
				</div>
			</form>
		</TicketShell>
	)
}

function Field({
	label,
	error,
	className,
	children
}: {
	label: string
	error?: string
	className?: string
	children: React.ReactNode
}) {
	return (
		<div className={`grid gap-2 ${className ?? ''}`}>
			<Label>{label}</Label>
			{children}
			{error ? <p className="text-destructive text-xs">{error}</p> : null}
		</div>
	)
}
