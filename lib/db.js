import { createClient } from '@supabase/supabase-js'

export const db = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY)

export const ok = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}
