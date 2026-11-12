import { db, ok } from '@/lib/db'
import { dinero, hoy, margen } from '@/lib/format'

const suma = (lista, campo) => lista.reduce((t, p) => t + p[campo], 0)

export default async function Resumen({ searchParams }) {
  const { mes = hoy().slice(0, 7) } = await searchParams
  const todos = ok(await db().from('pedidos_calc').select())
  const delMes = todos.filter(p => p.fecha_entrada.startsWith(mes))
  const total = suma(delMes, 'total')
  const ganancia = suma(delMes, 'ganancia')

  const datos = [
    ['Ventas', dinero(total), `${delMes.length} pedidos`],
    ['Costos', dinero(suma(delMes, 'costo')), 'materiales'],
    ['Ganancia', dinero(ganancia), `margen ${margen({ total, ganancia })}%`],
    ['Por cobrar del mes', dinero(suma(delMes, 'saldo')), 'saldo de estos pedidos'],
    ['Por cobrar en total', dinero(suma(todos, 'saldo')), 'todos los pedidos'],
  ]

  return (
    <>
      <h1 className="text-xl font-semibold">Resumen del mes</h1>
      <form className="flex gap-2">
        <input name="mes" type="month" defaultValue={mes} className="input" />
        <button className="btn">Ver</button>
      </form>
      <div className="grid grid-cols-2 gap-3">
        {datos.map(([titulo, valor, nota]) => (
          <div key={titulo} className="card last:col-span-2">
            <span className="label">{titulo}</span>
            <b className="text-xl">{valor}</b>
            <p className="text-xs text-cafe/70">{nota}</p>
          </div>
        ))}
      </div>
    </>
  )
}
