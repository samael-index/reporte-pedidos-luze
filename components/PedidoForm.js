import { guardarPedido } from '@/app/actions'
import { ESTADOS, hoy } from '@/lib/format'

export default function PedidoForm({ pedido = {} }) {
  return (
    <form action={guardarPedido.bind(null, pedido.id || null)} className="card grid grid-cols-2 gap-3">
      <label className="label col-span-2">Cliente
        <input name="cliente" defaultValue={pedido.cliente} required className="input text-cafe" />
      </label>
      <label className="label col-span-2">Teléfono
        <input name="telefono" type="tel" defaultValue={pedido.telefono} className="input text-cafe" />
      </label>
      <label className="label col-span-2">Producto
        <input name="producto" defaultValue={pedido.producto} className="input text-cafe" />
      </label>
      <label className="label col-span-2">Anotación
        <textarea name="anotacion" defaultValue={pedido.anotacion} rows="2" className="input text-cafe" />
      </label>
      <label className="label">Fecha de entrada
        <input name="fecha_entrada" type="date" defaultValue={pedido.fecha_entrada || hoy()} required className="input text-cafe" />
      </label>
      <label className="label">Fecha de entrega
        <input name="fecha_entrega" type="date" defaultValue={pedido.fecha_entrega} className="input text-cafe" />
      </label>
      <label className="label">Total
        <input name="total" type="number" inputMode="numeric" defaultValue={pedido.total} className="input text-cafe" />
      </label>
      <label className="label">Estado
        <select name="estado" defaultValue={pedido.estado} className="input capitalize text-cafe">
          {ESTADOS.map(e => <option key={e}>{e}</option>)}
        </select>
      </label>
      <button className="btn col-span-2">Guardar</button>
    </form>
  )
}
