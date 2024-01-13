import { Hono, MiddlewareHandler } from 'hono'
import { validator } from 'hono/validator'

import { login, signup } from '../../infraestructure/auth/auth'

const auth = new Hono()

const validateFields = (): MiddlewareHandler => {
    return validator('json', (value, c) => {
        if (!value || typeof value !== 'object') {
            c.status(500)
            return c.text('Parameters format are invalid')
        } else if (!value['fcUsername']) {
            c.status(500)
            return c.text('Username is required')
        } else if (!value['fcPassword']) {
            c.status(500)
            return c.text('Password is required')
        }
        return {
            body: value
        }
    })
}

auth.post('/login',
    validateFields(),
    login)

auth.post('/signup',
    validateFields(),
    signup)

export default auth
