import { employee } from '@prisma/client'

import { EmployeeDatasource } from '../../../domain/datasources/employee/employee_datasource'
import { EmployeeRepository } from '../../../domain/repositories/employee/employee_repository'
import { Employee } from '../../../domain/entities/employee';

export class IEmployeeRepository implements EmployeeRepository {
    private employeeDatasource: EmployeeDatasource

    constructor(employeeDatasource: EmployeeDatasource) {
        this.employeeDatasource = employeeDatasource
    }
    
    async findMany(): Promise<employee[] | null> {
        return await this.employeeDatasource.findMany()
    }
    async findFirst(id: number): Promise<employee | null> {
        return await this.employeeDatasource.findFirst(id)
    }
    async create(employee: Employee, createdBy: number): Promise<employee> {
        return await this.employeeDatasource.create(employee, createdBy)
    }
    async update(employee: Employee, createdBy: number): Promise<employee> {
        return await this.employeeDatasource.update(employee, createdBy)
    }
    async delete(id: number): Promise<employee> {
        return await this.employeeDatasource.delete(id)
    }

}