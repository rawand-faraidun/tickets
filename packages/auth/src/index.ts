import { createPrismaClient } from '@tickets-project/db'
import { env } from '@tickets-project/env/server'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

export function createAuth() {
	const prisma = createPrismaClient()

	return betterAuth({
		database: prismaAdapter(prisma, {
			provider: 'sqlite'
		}),

		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
				secure: env.NODE_ENV === 'production',
				httpOnly: true
			}
		},
		plugins: []
	})
}

export const auth = createAuth()
