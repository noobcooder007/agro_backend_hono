import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'

import auth from './presentation/auth/auth'
import employee from './presentation/employee/employee'

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

app.route('/auth', auth)
app.route('/api/employee', employee)
// app.route('/api/recipient', recipient)

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
