import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'EduEval - Plateforme d\'analyse des évaluations enseignants',
    template: '%s | EduEval',
  },
  description: 'Plateforme premium d\'analyse des évaluations des enseignants. Importez vos données CSV, visualisez les performances et générez des rapports détaillés.',
  keywords: ['évaluation', 'enseignants', 'analytics', 'école', 'éducation', 'rapports', 'performance'],
  authors: [{ name: 'EduEval' }],
  creator: 'EduEval',
  metadataBase: new URL('https://eduevalapp.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'EduEval - Plateforme d\'analyse des évaluations enseignants',
    description: 'Plateforme premium d\'analyse des évaluations des enseignants.',
    siteName: 'EduEval',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduEval - Plateforme d\'analyse des évaluations enseignants',
    description: 'Plateforme premium d\'analyse des évaluations des enseignants.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
