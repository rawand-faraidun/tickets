import type { Metadata } from 'next'
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
			<body className="antialiased">{children}</body>
		</html>
	)
}
