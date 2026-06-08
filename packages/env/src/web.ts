import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		SERVER_API_URL: z.url().optional()
	},
	client: {
		NEXT_PUBLIC_SERVER_URL: z.url()
	},
	runtimeEnv: {
		SERVER_API_URL: process.env.SERVER_API_URL,
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL
	},
	emptyStringAsUndefined: true
})
