// "use client"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import NextNProgress from 'nextjs-progressbar';
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fluxport Dashboard",
  description: "Smart Fluxport with advanced observability and token control",
  icons: {
    icon: "/fp-logo.webp",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
   
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    
      
      <body className={inter.className}>
      
       

        {children}
         
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
