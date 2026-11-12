import PedidoForm from '@/components/PedidoForm'
import MaterialPicker from '@/components/MaterialPicker'
import { agregarAbono, agregarMaterial, borrarPedido, quitarAbono, quitarMaterial } from '@/app/actions'
import { db, ok } from '@/lib/db'
import { dinero, fecha, hoy, margen, whatsapp } from '@/lib/format'

export default async function Pedido({ params }) {
  const { id } = await params
  const [pedido, usados, abonos, materiales] = await Promise.all([
    db().from('pedidos_calc').select().eq('id', id).single().then(ok),
    db().from('pedido_materiales').select('id, cantidad, materiales(nombre, unidad, costo_unitario)').eq('pedido_id', id).order('id').then(ok),
    db().from('abonos').select().eq('pedido_id', id).order('fecha').then(ok),
    db().from('materiales').select().order('nombre').then(ok),
  ])

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{pedido.cliente}</h1>
        {pedido.telefono && <a href={whatsapp(pedido.telefono)} target="_blank" className="btn">WhatsApp</a>}
      </div>

      <PedidoForm pedido={pedido} />

      <section className="card space-y-3">
        <h2 className="font-semibold">Materiales usados</h2>
        {usados.map(u => (
          <div key={u.id} className="flex items-center gap-2 text-sm">
            <span className="flex-1">{u.materiales.nombre}</span>
            <span className="text-cafe/70">{u.cantidad} {u.materiales.unidad}</span>
            <span className="w-20 text-right">{dinero(u.cantidad * u.materiales.costo_unitario)}</span>
            <form action={quitarMaterial.bind(null, u.id)}><button className="px-2 text-terracota">✕</button></form>
          </div>
        ))}
        <MaterialPicker materiales={materiales} action={agregarMaterial.bind(null, pedido.id)} />
        <div className="grid grid-cols-3 border-t border-cafe/10 pt-3 text-sm">
          <div><span className="label">Costo</span>{dinero(pedido.costo)}</div>
          <div><span className="label">Ganancia</span>{dinero(pedido.ganancia)}</div>
          <div><span className="label">Margen</span>{margen(pedido)}%</div>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">Abonos</h2>
        {abonos.map(a => (
          <div key={a.id} className="flex items-center gap-2 text-sm">
            <span className="flex-1">{fecha(a.fecha)}</span>
            <span>{dinero(a.valor)}</span>
            <form action={quitarAbono.bind(null, a.id)}><button className="px-2 text-terracota">✕</button></form>
          </div>
        ))}
        <form action={agregarAbono.bind(null, pedido.id)} className="flex flex-wrap gap-2">
          <input name="valor" type="number" inputMode="numeric" placeholder="Valor" required className="input flex-1 basis-28" />
          <input name="fecha" type="date" defaultValue={hoy()} required className="input flex-1 basis-36" />
          <button className="btn">Agregar</button>
        </form>
        <div className="grid grid-cols-3 border-t border-cafe/10 pt-3 text-sm">
          <div><span className="label">Total</span>{dinero(pedido.total)}</div>
          <div><span className="label">Abonado</span>{dinero(pedido.abonado)}</div>
          <div><span className="label">Saldo</span><b>{dinero(pedido.saldo)}</b></div>
        </div>
      </section>

      <form action={borrarPedido.bind(null, pedido.id)}>
        <button className="text-sm text-terracota underline">Eliminar pedido</button>
      </form>
    </>
  )
}
