import { entrar } from '@/app/actions'

export default async function Login({ searchParams }) {
  const { error } = await searchParams
  return (
    <form action={entrar} className="card mx-auto mt-10 max-w-xs space-y-3">
      <h1 className="text-lg font-semibold">Entrar</h1>
      <input name="clave" type="password" placeholder="Contraseña" autoFocus className="input" />
      {error && <p className="text-sm text-terracota">Contraseña incorrecta</p>}
      <button className="btn w-full">Entrar</button>
    </form>
  )
}
