import { Hono, MiddlewareHandler } from 'hono'
import { validator } from 'hono/validator'
import { EmployeeService } from '../../../infrastructure/service/employee/employee'
import { IEmployeeRepository } from '../../../infrastructure/repositories/employee/employee_repository_impl'
import { IEmployeeDatasource } from '../../../infrastructure/datasource/employee/employee_datasource_impl'

const employee = new Hono()
const employeeService = new EmployeeService(new IEmployeeRepository(new IEmployeeDatasource()))

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
    employeeService.createEmployee)

employee.get('/',
    employeeService.getEmployees)

employee.get('/:id',
    employeeService.getEmployeeById)

employee.patch('/',
    employeeService.updateEmployee)

employee.delete('/:id',
    employeeService.deleteEmployee)

export default employee
