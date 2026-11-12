'use client'

import { useState } from 'react'
import { dinero } from '@/lib/format'

export default function MaterialPicker({ materiales, action }) {
  const [id, setId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const material = materiales.find(m => m.id == id)

  return (
    <form
      action={async form => {
        await action(form)
        setCantidad('')
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <select name="material_id" value={id} onChange={e => setId(e.target.value)} required className="input flex-1 basis-40">
        <option value="">Material…</option>
        {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>)}
      </select>
      <input
        name="cantidad"
        type="number"
        step="any"
        inputMode="decimal"
        placeholder="Cantidad"
        value={cantidad}
        onChange={e => setCantidad(e.target.value)}
        required
        className="input w-28"
      />
      <b className="w-20 text-right">{dinero((material?.costo_unitario || 0) * cantidad)}</b>
      <button className="btn">Agregar</button>
    </form>
  )
}
