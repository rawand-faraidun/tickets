import { Button } from '@tickets-project/ui/components/button'
import Link from 'next/link'

/**
 * 404 error page
 */
export default function NotFound() {
	return (
		<main className="flex h-[90vh] items-center justify-center">
			<div className="flex flex-col items-center justify-between gap-6">
				<h1 className="text-5xl">404</h1>
				<h2 className="text-lg">Not found</h2>
				<Link href="/dashboard">
					<Button variant="secondary">Back to dashboard</Button>
				</Link>
			</div>
		</main>
	)
}
