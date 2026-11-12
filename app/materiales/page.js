import { borrarMaterial, guardarMaterial } from '@/app/actions'
import { db, ok } from '@/lib/db'
import { UNIDADES } from '@/lib/format'

function Fila({ material = {} }) {
  return (
    <form action={guardarMaterial.bind(null, material.id || null)} className="card flex flex-wrap items-center gap-2">
      <input name="nombre" defaultValue={material.nombre} placeholder="Nombre" required className="input flex-1 basis-full sm:basis-40" />
      <select name="unidad" defaultValue={material.unidad} className="input w-24">
        {UNIDADES.map(u => <option key={u}>{u}</option>)}
      </select>
      <input name="costo_unitario" type="number" step="any" inputMode="decimal" defaultValue={material.costo_unitario} placeholder="Costo" className="input w-28 flex-1" />
      <button className="btn">{material.id ? 'Guardar' : 'Agregar'}</button>
      {material.id && <button formAction={borrarMaterial.bind(null, material.id)} className="px-2 text-terracota">✕</button>}
    </form>
  )
}

export default async function Materiales() {
  const materiales = ok(await db().from('materiales').select().order('nombre'))
  return (
    <>
      <h1 className="text-xl font-semibold">Materiales</h1>
      <p className="text-sm text-cafe/70">Costo por unidad de medida (por gramo, mililitro, unidad o metro).</p>
      <Fila />
      {materiales.map(m => <Fila key={m.id} material={m} />)}
    </>
  )
}
