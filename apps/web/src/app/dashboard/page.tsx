import { redirect } from 'next/navigation'
import { homeForRole, requireServerUser } from '@/lib/server-trpc'

export default async function DashboardPage() {
	// auth guard
	const me = await requireServerUser()

	redirect(homeForRole(me.user.role))
}
