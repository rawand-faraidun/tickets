import { PrismaLibSql } from '@prisma/adapter-libsql'
import { env } from '@tickets-project/env/server'
import { PrismaClient } from '../prisma/generated/client'

export {
	ContactPreference,
	Prisma,
	TicketCategory,
	TicketPriority,
	TicketStatus,
	UserRole
} from '../prisma/generated/client'
export type { PrismaClient }

export function createPrismaClient() {
	const adapter = new PrismaLibSql({
		url: env.DATABASE_URL
	})

	return new PrismaClient({ adapter })
}

const prisma = createPrismaClient()
export default prisma
