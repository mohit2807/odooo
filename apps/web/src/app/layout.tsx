import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFinds - Sustainable Second-Hand Marketplace',
  description: 'Building a sustainable future, one second-hand treasure at a time. Reduce, reuse, and discover amazing finds in our eco-friendly marketplace.',
  keywords: ['sustainable', 'second-hand', 'marketplace', 'eco-friendly', 'reuse', 'reduce'],
  authors: [{ name: 'EcoFinds Team' }],
  openGraph: {
    title: 'EcoFinds - Sustainable Second-Hand Marketplace',
    description: 'Building a sustainable future, one second-hand treasure at a time.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoFinds - Sustainable Second-Hand Marketplace',
    description: 'Building a sustainable future, one second-hand treasure at a time.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
