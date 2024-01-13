import { Context } from 'hono'
import { sign } from 'hono/jwt'

import { PrismaClient } from '@prisma/client'

import { User } from '../../domain/models/user'

const prisma = new PrismaClient()

const signup = async (c: Context) => {
    const { fcUsername, fcPassword } = await c.req.json<User>()
    try {
        const usernameExist = await prisma.user.findFirst({
            where: {
                fcUsername: fcUsername
            }
        })
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
        const userCreated = await prisma.user.create({
            data: {
                ...user
            }
        })
        const payload = {
            pkiId: userCreated.pkiId
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

const login = async (c: Context) => {
    const { fcUsername, fcPassword } = await c.req.json<User>()
    try {
        const userDB = await prisma.user.findFirst({
            where: { fcUsername: fcUsername }
        })
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

export {
    login,
    signup,
}
