import Link from 'next/link'
import { db, ok } from '@/lib/db'
import { ESTADOS, dinero, fecha, semana, whatsapp } from '@/lib/format'

export default async function Pedidos({ searchParams }) {
  const { estado } = await searchParams
  let consulta = db().from('pedidos_calc').select().order('fecha_entrega', { nullsFirst: false })
  if (estado) consulta = consulta.eq('estado', estado)
  const pedidos = ok(await consulta)
  const [inicio, fin] = semana()

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <Link href="/pedidos/nuevo" className="btn">+ Nuevo</Link>
      </div>

      <div className="flex gap-2 overflow-x-auto text-sm">
        {['', ...ESTADOS].map(e => (
          <Link
            key={e}
            href={e ? `/?estado=${e}` : '/'}
            className={`whitespace-nowrap rounded-full border border-cafe/20 px-3 py-1 capitalize ${(estado || '') === e ? 'bg-cafe text-crema' : 'bg-white'}`}
          >
            {e || 'Todos'}
          </Link>
        ))}
      </div>

      {pedidos.map(p => {
        const estaSemana = p.fecha_entrega >= inicio && p.fecha_entrega <= fin
        return (
          <div key={p.id} className={`card space-y-2 ${estaSemana ? 'border-2 border-terracota bg-terracota/10' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/pedidos/${p.id}`} className="font-semibold">{p.cliente}</Link>
              <span className="rounded-full bg-cafe/10 px-2 py-0.5 text-xs capitalize">{p.estado}</span>
            </div>
            <p className="text-sm">{p.producto}</p>
            <p className="text-sm text-cafe/70">
              Entrega: {fecha(p.fecha_entrega)}
              {estaSemana && <b className="text-terracota"> · esta semana</b>}
            </p>
            <div className="grid grid-cols-3 text-sm">
              <div><span className="label">Total</span>{dinero(p.total)}</div>
              <div><span className="label">Saldo</span>{dinero(p.saldo)}</div>
              <div><span className="label">Ganancia</span>{dinero(p.ganancia)}</div>
            </div>
            <div className="flex gap-4 text-sm font-medium text-terracota">
              <Link href={`/pedidos/${p.id}`}>Abrir</Link>
              {p.telefono && <a href={whatsapp(p.telefono)} target="_blank">WhatsApp</a>}
            </div>
          </div>
        )
      })}
      {!pedidos.length && <p className="text-sm text-cafe/70">No hay pedidos.</p>}
    </>
  )
}
