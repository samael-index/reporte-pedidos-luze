import { createHash } from 'crypto'

export const token = () => createHash('sha256').update(process.env.APP_PASSWORD).digest('hex')
