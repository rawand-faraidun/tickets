import { cn } from '@tickets-project/ui/lib/utils'
import type { ReactNode } from 'react'

type NavItem = {
	href: string
	label: string
	active?: boolean
}

export function TicketShell({
	title,
	subtitle,
	navTitle,
	navItems,
	action,
	children
}: {
	title: string
	subtitle: string
	navTitle: string
	navItems: NavItem[]
	action?: ReactNode
	children: ReactNode
}) {
	return (
		<main className="min-h-[calc(100svh-57px)] bg-muted/30">
			<div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[240px_minmax(0,1fr)]">
				<aside className="rounded-lg border bg-card p-3 shadow-sm lg:sticky lg:top-[77px] lg:h-[calc(100svh-97px)]">
					<div className="mb-3 hidden px-3 font-semibold text-sm lg:block">{navTitle}</div>
					<nav className="flex gap-2 overflow-x-auto lg:grid">
						{navItems.map(item => (
							<a
								key={item.href}
								href={item.href}
								className={cn(
									'whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
									item.active && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
								)}
							>
								{item.label}
							</a>
						))}
					</nav>
				</aside>
				<section className="min-w-0 overflow-hidden rounded-lg border bg-card shadow-sm">
					<div className="flex flex-wrap items-start justify-between gap-3 border-b bg-card px-5 py-4">
						<div>
							<h1 className="font-semibold text-xl tracking-normal">{title}</h1>
							<p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
						</div>
						{action}
					</div>
					<div className="p-5">{children}</div>
				</section>
			</div>
		</main>
	)
}
