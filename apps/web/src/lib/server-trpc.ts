import type { AppRouter } from '@tickets-project/api/routers/index'
import { env } from '@tickets-project/env/web'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type UserRole = 'CUSTOMER' | 'AGENT'

/**
 * create trpc server client
 *
 * @returns server trpc client
 */
export async function createServerTrpcClient() {
	// server api
	const requestHeaders = await headers()

	return createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `${env.SERVER_API_URL ?? env.NEXT_PUBLIC_SERVER_URL}/trpc`,
				headers() {
					return {
						cookie: requestHeaders.get('cookie') ?? ''
					}
				},
				fetch(url, options) {
					return fetch(url, {
						...options,
						cache: 'no-store'
					})
				}
			})
		]
	})
}

/**
 * server user validation
 *
 * @returns server user
 */
export async function getServerUser() {
	// session lookup
	const trpc = await createServerTrpcClient()

	try {
		return await trpc.me.query()
	} catch {
		return null
	}
}

/**
 * tickets path per role
 *
 * @param role - user role
 *
 * @returns server path
 */
export function homeForRole(role: UserRole) {
	return role === 'AGENT' ? '/agent/tickets' : '/tickets'
}

/**
 * authorize for users
 *
 * @returns server user
 */
export async function requireServerUser() {
	// auth guard
	const me = await getServerUser()

	if (!me) {
		redirect('/login')
	}

	return me
}

/**
 * authorize per role
 *
 * @param role - user role
 *
 * @returns server user
 */
export async function requireServerRole(role: UserRole) {
	// role guard
	const me = await requireServerUser()

	if (me.user.role !== role) {
		redirect(homeForRole(me.user.role))
	}

	return me
}
