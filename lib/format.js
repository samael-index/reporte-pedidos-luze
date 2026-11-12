export const ESTADOS = ['pendiente', 'en producción', 'listo', 'entregado']
export const UNIDADES = ['g', 'ml', 'unidad', 'metro']

export const dinero = n => '$' + String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const fecha = f => (f ? f.split('-').reverse().join('/') : 'Sin fecha')

export const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' })

export const semana = () => {
  const d = new Date(hoy() + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  const inicio = d.toISOString().slice(0, 10)
  d.setUTCDate(d.getUTCDate() + 6)
  return [inicio, d.toISOString().slice(0, 10)]
}

export const margen = p => (p.total > 0 ? Math.round((p.ganancia / p.total) * 100) : 0)

export const whatsapp = telefono => {
  const n = telefono.replace(/\D/g, '')
  return `https://wa.me/${n.length === 10 ? '57' + n : n}`
}
