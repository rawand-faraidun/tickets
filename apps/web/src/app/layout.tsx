import type { Metadata } from 'next'
import Header from '@/components/header'
import Providers from '@/components/providers'
import '../index.css'

/**
 * default meta tags
 */
export const metadata: Metadata = {
	title: 'Helpdesk Ticketing',
	description: 'Customer support ticketing system'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="antialiased">
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	)
}
