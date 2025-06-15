// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comandas App',
  description: 'Gestión de órdenes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-bold text-center">Comandas Sportbar 1611</h1>
          <div className=' bg-sky-500/90 text-white'>
           <p className='text-white-50 text-center'>Test</p>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}