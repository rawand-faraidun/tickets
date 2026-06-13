import { redirect } from 'next/navigation'
import { getServerUser, homeForRole } from '@/lib/server-trpc'
import LoginClient from './login-client'

export default async function LoginPage() {
	// auth guard
	const me = await getServerUser()

	if (me) {
		redirect(homeForRole(me.user.role))
	}

	return <LoginClient />
}
