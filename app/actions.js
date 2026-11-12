'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db, ok } from '@/lib/db'
import { token } from '@/lib/auth'

export async function entrar(form) {
  if (form.get('clave') !== process.env.APP_PASSWORD) redirect('/login?error=1')
  const jar = await cookies()
  jar.set('sesion', token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  redirect('/')
}

export async function guardarPedido(id, form) {
  const datos = {
    cliente: form.get('cliente'),
    telefono: form.get('telefono'),
    producto: form.get('producto'),
    anotacion: form.get('anotacion'),
    fecha_entrada: form.get('fecha_entrada'),
    fecha_entrega: form.get('fecha_entrega') || null,
    total: form.get('total') || 0,
    estado: form.get('estado'),
  }
  if (id) ok(await db().from('pedidos').update(datos).eq('id', id))
  else id = ok(await db().from('pedidos').insert(datos).select('id').single()).id
  revalidatePath('/', 'layout')
  redirect(`/pedidos/${id}`)
}

export async function borrarPedido(id) {
  ok(await db().from('pedidos').delete().eq('id', id))
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function agregarMaterial(pedido_id, form) {
  ok(await db().from('pedido_materiales').insert({
    pedido_id,
    material_id: form.get('material_id'),
    cantidad: form.get('cantidad'),
  }))
  revalidatePath('/', 'layout')
}

export async function quitarMaterial(id) {
  ok(await db().from('pedido_materiales').delete().eq('id', id))
  revalidatePath('/', 'layout')
}

export async function agregarAbono(pedido_id, form) {
  ok(await db().from('abonos').insert({ pedido_id, valor: form.get('valor'), fecha: form.get('fecha') }))
  revalidatePath('/', 'layout')
}

export async function quitarAbono(id) {
  ok(await db().from('abonos').delete().eq('id', id))
  revalidatePath('/', 'layout')
}

export async function guardarMaterial(id, form) {
  const datos = {
    nombre: form.get('nombre'),
    unidad: form.get('unidad'),
    costo_unitario: form.get('costo_unitario') || 0,
  }
  if (id) ok(await db().from('materiales').update(datos).eq('id', id))
  else ok(await db().from('materiales').insert(datos))
  revalidatePath('/', 'layout')
}

export async function borrarMaterial(id) {
  ok(await db().from('materiales').delete().eq('id', id))
  revalidatePath('/', 'layout')
}
