import { Context } from 'hono'
import { decode, sign } from 'hono/jwt'

import { User } from '../../../domain/entities/user'
import { UserRepository } from '../../../domain/repositories/auth/user_repository'

export class AuthService {
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    public signup = async (c: Context) => {
        const { fcUsername, fcPassword } = await c.req.json<User>()
        try {
            const usernameExist = await this.userRepository.findFirst(fcUsername)
            if (usernameExist) {
                c.status(404)
                return c.json({
                    ok: false,
                    msg: 'Sorry, the username is already used'
                })
            }
            const user = await c.req.json<User>()
            user.fcPassword = await Bun.password.hash(fcPassword, { algorithm: 'bcrypt' })
            user.fdCreatedAt = new Date()
            user.fiIsActive = true
            const userCreated = await this.userRepository.create(user)
            const payload = {
                pkiId: userCreated!.pkiId
            }
            const token = await sign(payload, c.env!.JWT_SECRET as string)
            c.status(201)
            return c.json({
                ok: true,
                token
            })
        } catch (error) {
            c.status(500)
            return c.json({
                ok: false,
                msg: 'Something went wrong'
            })
        }
    }
    
    public login = async (c: Context) => {
        const { fcUsername, fcPassword } = await c.req.json<User>()
        try {
            const userDB = await this.userRepository.findFirst(fcUsername)
            if (!userDB) {
                c.status(404)
                return c.json({
                    ok: false,
                    msg: 'User not found'
                })
            }
            const validPassword = await Bun.password.verify(fcPassword, userDB?.fcPassword!)
            if (!validPassword) {
                c.status(404)
                return c.json({
                    ok: false,
                    msg: 'Password incorrect'
                })
            }
            const payload = {
                exp: (Date.now()/1000) + 3600,
                pkiId: userDB.pkiId
            }
            const token = await sign(payload, c.env!.JWT_SECRET as string)
            return c.json({
                ok: true,
                token
            })
        } catch (error) {
            c.status(500)
            return c.json({
                ok: false,
                msg: 'Something went wrong'
            })
        }
    }

    public renew = async (c: Context) => {
        const token = c.req.header('x-token')
        if (token === 'no-token') {
            return c.json({
                ok: false,
                msg: 'Token is invalid'
            })
        }
        const { payload } = decode(token!)
        const jwtPayload = {
            exp: (Date.now()/1000) + 3600,
            pkiId: payload.pkiId
        }
        const renewToken = await sign(jwtPayload, c.env!.JWT_SECRET as string)
        return c.json({
            ok: true,
            token: renewToken
        })
    }

}
