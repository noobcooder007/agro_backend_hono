import { Context } from 'hono'

import { PrismaClient } from '@prisma/client'
import { Employee } from '../../domain/models/employee'

const prisma = new PrismaClient()

const getEmployees = async (c: Context) => {
    try {
        const employees = await prisma.employee.findMany(
            {
                orderBy: {
                    pkiId: 'asc'
                }
            }
        )
        c.status(200)
        return c.json({
            ok: true,
            employees
        })
    } catch (error) {
        c.status(500)
        return c.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

const getEmployeeById = async (c: Context) => {
    try {
        const employee = await prisma.employee.findFirst({
            where: { pkiId: parseInt(c.req.param('id')), fiIsActive: true }
        })
        if (employee) {
            c.status(200)
            return c.json({
                ok: true,
                employee
            })
        } else {
            c.status(404)
            return c.json({
                ok: false,
                msg: 'Employee not found'
            })
        }
    } catch (error) {
        c.status(500)
        return c.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

const createEmployee = async (c: Context) => {
    try {
        const payload = c.get('jwtPayload')
        const newEmployee = await c.req.json<Employee>()
        newEmployee.fdCreatedAt = new Date()
        await prisma.employee.create({
            data: {
                ...newEmployee,
                fkiCreatedBy: payload.pkiId
            }
        })
        c.status(201)
        return c.json({
            ok: true
        })
    } catch (error) {
        c.status(500)
        return c.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

const deleteEmployee = async (c: Context) => {
    try {
        await prisma.employee.delete({
            where: { pkiId: parseInt(c.req.param('id')) }
        })
        c.status(200)
        return c.json({
            ok: true,
            msg: 'Employee deleted'
        })
    } catch (error) {
        c.status(500)
        return c.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

const updateEmployee = async (c: Context) => {
    try {
        const payload = c.get('jwtPayload')
        const employee = await c.req.json<Employee>()
        await prisma.employee.update({
            data: {
                ...employee,
                fkiCreatedBy: payload.pkiId
            },
            where: { pkiId: employee.pkiId },
        })
        c.status(200)
        return c.json({
            ok: true,
            msg: 'Employee updated'
        })
    } catch (error) {
        console.log(error);
        
        c.status(500)
        return c.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

export {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}
