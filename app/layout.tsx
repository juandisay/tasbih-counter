import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tasbih Counter',
  description: 'Created with juandisay',
  generator: 'juandisay',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
