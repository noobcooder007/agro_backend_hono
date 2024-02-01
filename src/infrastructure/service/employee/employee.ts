import { Context } from 'hono'

import { Employee } from '../../../domain/entities/employee'
import { EmployeeRepository } from '../../../domain/repositories/employee/employee_repository'

export class EmployeeService {
    private employeeRespository: EmployeeRepository

    constructor(employeeRepository: EmployeeRepository) {
        this.employeeRespository = employeeRepository
    }

    public getEmployees = async (c: Context) => {
        try {
            const employees = await this.employeeRespository.findMany()
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
    
    public getEmployeeById = async (c: Context) => {
        try {
            const id = parseInt(c.req.param('id'))
            const employee = await this.employeeRespository.findFirst(id)
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
    
    public createEmployee = async (c: Context) => {
        try {
            const payload = c.get('jwtPayload')
            const newEmployee = await c.req.json<Employee>()
            newEmployee.fdCreatedAt = new Date()
            await this.employeeRespository.create(newEmployee, payload.pkiId)
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
    
    public updateEmployee = async (c: Context) => {
        try {
            const payload = c.get('jwtPayload')
            const employee = await c.req.json<Employee>()
            await this.employeeRespository.update(employee, payload.pkiId)
            c.status(200)
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

    public deleteEmployee = async (c: Context) => {
        try {
            const id = parseInt(c.req.param('id'))
            await this.employeeRespository.delete(id)
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

}
