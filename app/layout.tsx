import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/components/providers/redux-provider'
import './globals.css'

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: 'FluxPort API Gateway',
  description: 'Professional API Observability & Interception',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
