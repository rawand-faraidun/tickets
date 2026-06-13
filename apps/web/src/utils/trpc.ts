import { QueryCache, QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@tickets-project/api/routers/index'
import { env } from '@tickets-project/env/web'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { toast } from 'sonner'

/**
 * query client resolver
 */
export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(error.message, {
				action: {
					label: 'retry',
					onClick: () => {
						query.invalidate()
					}
				}
			})
		}
	})
})

/**
 * client caller
 */
const api = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include'
				})
			}
		})
	]
})

/**
 * server caller
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: api,
	queryClient
})
