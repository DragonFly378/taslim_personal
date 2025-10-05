import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { AppShell } from '@/components/AppShell'
import { Toaster } from '@/components/ui/toaster'
import { MergeGuestDataDialog } from '@/components/MergeGuestDataDialog'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taslim - Quran & Daily Duas',
  description: 'Read the Quran and Daily Islamic Duas with bookmarking',
  icons: {
    icon: '/images/logo_taslim_mark.png',
    apple: '/images/logo_taslim_mark.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextAuthProvider>
          <LanguageProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
            <MergeGuestDataDialog />
          </LanguageProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
