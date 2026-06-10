// biome-ignore-all lint/suspicious/noConsole: ignore

import { serve } from '@hono/node-server'
import { auth } from '@tickets-project/auth'
import { env } from '@tickets-project/env/server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// hono router
const app = new Hono()

// access logger
app.use(logger())

// cors
app.use(
	'/*',
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	})
)

// auth route
app.on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))

// health
app.get('/', c => {
	return c.text('OK')
})

// starting server
serve({ fetch: app.fetch, port: 3000 }, info => {
	console.log('Server is running')
	console.log(`http://localhost:${info.port}`)
	console.log('')
})
