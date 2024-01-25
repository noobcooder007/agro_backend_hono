import { Hono, MiddlewareHandler } from 'hono'
import { validator } from 'hono/validator'

import { AuthService } from '../../../infrastructure/service/auth/auth'
import { IUserRepository } from '../../../infrastructure/repositories/auth/user_repository_impl'
import { IUserDatasource } from '../../../infrastructure/datasource/auth/user_datasource_impl'

const auth = new Hono()
const authService = new AuthService(new IUserRepository(new IUserDatasource()))

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
    authService.login)

auth.post('/signup',
    validateFields(),
    authService.signup)

auth.post('/renew',
    authService.renew)

export default auth
