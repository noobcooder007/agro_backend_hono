import { Hono, MiddlewareHandler } from 'hono'
import { validator } from 'hono/validator'

import { createEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from '../../infraestructure/employee/employee'

const employee = new Hono()

const validateFields = (): MiddlewareHandler => {
    return validator('json', (value, c) => {
        if (!value || typeof value !== 'object') {
            c.status(500)
            return c.text('Parameters format are invalid')
        } else if (!value['fcFirstname']) {
            c.status(500)
            return c.text('Firstname is required')
        } else if (!value['fcFirstLastname']) {
            c.status(500)
            return c.text('First lastname is required')
        } else if (!value['fcSecondLastname']) {
            c.status(500)
            return c.text('Second lastname is required')
        } else if (!value['fdBirthday']) {
            c.status(500)
            return c.text('Birthday is required')
        }
        return {
            body: value
        }
    })
}

employee.post('/',
    validateFields(),
    createEmployee)

employee.get('/',
    getEmployees)

employee.get('/:id',
    getEmployeeById)

employee.patch('/',
    updateEmployee)

employee.delete('/:id',
    deleteEmployee)

export default employee
