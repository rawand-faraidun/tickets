'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { type TicketStatusValue, ticketStatusLabels, ticketStatusValues } from '@tickets-project/api/ticket-options'
import { Button, buttonVariants } from '@tickets-project/ui/components/button'
import { Label } from '@tickets-project/ui/components/label'
import { Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { queryClient, trpc } from '@/utils/trpc'
import { PriorityBadge, StatusBadge } from './ticket-badges'
import { categoryLabel, contactPreferenceLabel, formatDateTime, formatShortDate, priorityLabel } from './ticket-format'
import { TicketShell } from './ticket-shell'
import type { TicketDetailRecord } from './ticket-types'

export function TicketDetail({
	id,
	initialTicket,
	agent
}: {
	id: string
	initialTicket: TicketDetailRecord
	agent?: boolean
}) {
	const router = useRouter()
	const [body, setBody] = useState('')
	const [status, setStatus] = useState<TicketStatusValue | ''>('')

	// api
	const ticket = useQuery(
		trpc.tickets.byId.queryOptions(
			{ id },
			{
				initialData: initialTicket
			}
		)
	)
	const addComment = useMutation(
		trpc.tickets.addComment.mutationOptions({
			onSuccess: async () => {
				setBody('')
				await queryClient.invalidateQueries()
				toast.success('Reply posted')
			}
		})
	)

	const updateStatus = useMutation(
		trpc.tickets.updateStatus.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries()
				toast.success('Status updated')
			}
		})
	)

	if (ticket.isLoading) {
		return (
			<TicketShell
				title="Loading ticket"
				subtitle="Fetching ticket detail."
				navTitle={agent ? 'Agent Console' : 'Customer Portal'}
				navItems={[
					{
						href: agent ? '/agent/tickets' : '/tickets',
						label: agent ? 'Queue' : 'My Tickets'
					}
				]}
			>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Loader2 className="size-4 animate-spin" />
					Loading ticket...
				</div>
			</TicketShell>
		)
	}

	if (!ticket.data) {
		return (
			<TicketShell
				title="Ticket unavailable"
				subtitle="The ticket was not found or you do not have access."
				navTitle={agent ? 'Agent Console' : 'Customer Portal'}
				navItems={[
					{
						href: agent ? '/agent/tickets' : '/tickets',
						label: agent ? 'Queue' : 'My Tickets'
					}
				]}
			>
				<Link className={buttonVariants({ variant: 'outline' })} href={agent ? '/agent/tickets' : '/tickets'}>
					Back to tickets
				</Link>
			</TicketShell>
		)
	}

	const currentStatus = status || ticket.data.status
	const hasReply = body.trim().length >= 2
	const statusChanged = Boolean(agent && currentStatus !== ticket.data.status)

	return (
		<TicketShell
			title={`${ticket.data.ticketNumber}: ${ticket.data.title}`}
			subtitle={`${categoryLabel(ticket.data.category)} submitted by ${ticket.data.customer.name}.`}
			navTitle={agent ? 'Agent Console' : 'Customer Portal'}
			navItems={[
				{
					href: agent ? '/agent/tickets' : '/tickets',
					label: agent ? 'Queue' : 'My Tickets'
				},
				{
					href: agent ? `/agent/tickets/${ticket.data.id}` : `/tickets/${ticket.data.id}`,
					label: ticket.data.ticketNumber,
					active: true
				},
				...(!agent ? [{ href: '/tickets/new', label: 'Create Ticket' }] : [])
			]}
			action={
				<div className="flex gap-2">
					<StatusBadge status={ticket.data.status} />
					<PriorityBadge priority={ticket.data.priority} />
				</div>
			}
		>
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
				{/* comments */}
				<section className="grid gap-3">
					{ticket.data.comments.map(comment => (
						<article key={comment.id} className="rounded-md border bg-background p-4">
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<h2 className="font-semibold text-sm">{comment.author.name}</h2>
								<span className="text-muted-foreground text-xs">
									Public comment - {formatDateTime(comment.createdAt)}
								</span>
							</div>
							<p className="mt-3 whitespace-pre-wrap text-foreground text-sm">{comment.body}</p>
						</article>
					))}

					<form
						className="grid gap-3 rounded-md border bg-muted/20 p-4"
						onSubmit={event => {
							// form submit handler
							event.preventDefault()
							if (hasReply) {
								addComment.mutate({ id: ticket.data.id, body })
							}
							if (statusChanged) {
								updateStatus.mutate({
									id: ticket.data.id,
									status: currentStatus
								})
							}
						}}
					>
						<div className="grid gap-2">
							<Label htmlFor="reply">Add reply</Label>
							<textarea
								id="reply"
								className="min-h-28 rounded-none border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
								value={body}
								onChange={event => setBody(event.target.value)}
								placeholder="Write a public reply..."
							/>
						</div>
						{agent ? (
							<div className="grid gap-2 sm:max-w-xs">
								<Label htmlFor="status">Update status</Label>
								<select
									id="status"
									className="h-9 rounded-none border border-input bg-background px-2 text-sm"
									value={currentStatus}
									onChange={event => setStatus(event.target.value as TicketStatusValue)}
								>
									{ticketStatusValues.map(value => (
										<option key={value} value={value}>
											{ticketStatusLabels[value]}
										</option>
									))}
								</select>
							</div>
						) : null}
						<div className="flex flex-wrap gap-2">
							<Button
								type="submit"
								disabled={addComment.isPending || updateStatus.isPending || (!hasReply && !statusChanged)}
							>
								{addComment.isPending || updateStatus.isPending ? <Loader2 className="animate-spin" /> : <Send />}
								Post Update
							</Button>
							<Button type="button" variant="outline" onClick={() => router.back()}>
								Back
							</Button>
						</div>
					</form>
				</section>

				{/* metadata */}
				<aside className="grid content-start gap-3 rounded-md border bg-background p-4 text-sm">
					<h2 className="font-semibold">Metadata</h2>
					<Meta label="Customer" value={ticket.data.customer.name} />
					<Meta label="Status" value={ticketStatusLabels[ticket.data.status]} />
					<Meta label="Priority" value={priorityLabel(ticket.data.priority)} />
					<Meta label="Category" value={categoryLabel(ticket.data.category)} />
					<Meta label="Created" value={formatDateTime(ticket.data.createdAt)} />
					<Meta label="Updated" value={formatShortDate(ticket.data.updatedAt)} />
					<Meta label="Booked support time" value={formatDateTime(ticket.data.bookedAt)} />
					<Meta label="Contact preference" value={contactPreferenceLabel(ticket.data.contactPreference)} />
				</aside>
			</div>
		</TicketShell>
	)
}

function Meta({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<div className="font-medium text-muted-foreground text-xs">{label}</div>
			<div className="mt-1">{value}</div>
		</div>
	)
}
