import { Context, Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'

import auth from './presentation/controllers/auth/auth'
import employee from './presentation/controllers/employee/employee'

const port = parseInt(process.env.PORT!) || 3000

const app = new Hono()

app.use('/api/*',
  (c, next) => {
    const jwtMiddleware = jwt({
      secret: c.env!.JWT_SECRET as string,
    })
    return jwtMiddleware(c, next)
  })

app.use('*', logger())

app.get('/', (c: Context) => {
  return c.text('Bienvenido a Agro Bonsai')
})

app.route('/auth', auth)
app.route('/api/employee', employee)

app.notFound((c) => {
  c.status(404)
  return c.json({
    ok: false,
    msg: '404 - Not found'
  })
})

export default {
  port,
  fetch: app.fetch
}
