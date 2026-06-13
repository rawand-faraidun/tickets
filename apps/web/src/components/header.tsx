'use client'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import UserMenu from './user-menu'

export default function Header() {
	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-3 px-4 py-3">
				<Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sm">
					<span className="grid size-8 place-items-center rounded-md bg-teal-700 text-white text-xs">HD</span>
					<span>Helpdesk</span>
				</Link>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
		</header>
	)
}
