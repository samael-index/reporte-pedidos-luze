import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'Velas Luze · Pedidos' }
export const dynamic = 'force-dynamic'

export default function Layout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-crema text-cafe">
        <header className="bg-cafe text-crema">
          <nav className="mx-auto flex max-w-2xl items-center gap-4 p-4 text-sm">
            <Link href="/" className="mr-auto text-base font-semibold">Velas Luze</Link>
            <Link href="/">Pedidos</Link>
            <Link href="/materiales">Materiales</Link>
            <Link href="/resumen">Resumen</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-2xl space-y-4 p-4">{children}</main>
      </body>
    </html>
  )
}
