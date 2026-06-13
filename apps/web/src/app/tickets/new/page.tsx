import { requireServerRole } from '@/lib/server-trpc'
import NewTicketClient from './new-ticket-client'

export default async function NewTicketPage() {
	// auth guard
	await requireServerRole('CUSTOMER')

	return <NewTicketClient />
}
