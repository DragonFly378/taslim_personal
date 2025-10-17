import type { Metadata } from 'next'
import { Inter, Amiri, Scheherazade_New } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { AppShell } from '@/components/AppShell'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
})

const scheherazade = Scheherazade_New({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-scheherazade',
})

export const metadata: Metadata = {
  title: 'Taslim - Quran & Daily Duas',
  description: 'Read the Quran and Daily Islamic Duas with bookmarking - Works offline',
  icons: {
    icon: '/images/logo_taslim_mark.png',
    apple: '/images/logo_taslim_mark.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Taslim',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#059669',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${amiri.variable} ${scheherazade.variable}`} suppressHydrationWarning>
        <LanguageProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
