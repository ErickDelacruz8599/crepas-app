import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Creperia Dulce | Crepas Artesanales',
  description: 'Crea tu crepa perfecta con ingredientes frescos y deliciosos. Personaliza tu orden y disfruta de las mejores crepas de la ciudad.',
  keywords: ['crepas', 'creperia', 'postres', 'dulces', 'artesanales'],
}

export const viewport: Viewport = {
  themeColor: '#f5a3b5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={nunito.variable}>
      <body className="font-sans antialiased bg-background min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
