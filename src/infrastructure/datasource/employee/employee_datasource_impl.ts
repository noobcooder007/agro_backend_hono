import { PrismaClient, employee } from '@prisma/client'

import { EmployeeDatasource } from '../../../domain/datasources/employee/employee_datasource'
import { Employee } from '../../../domain/entities/employee'

export class IEmployeeDatasource implements EmployeeDatasource {
    private prisma = new PrismaClient()
    async findMany(): Promise<employee[] | null> {
        return await this.prisma.employee.findMany({
            where: {
                fiIsActive: true
            },
            orderBy: [{
                fcFirstLastname: 'asc'
            }]
        })
    }
    async findManyActives(): Promise<employee[] | null> {
        return await this.prisma.employee.findMany({
            orderBy: [{
                fcFirstLastname: 'asc'
            }]
        })
    }
    async findFirst(id: number): Promise<employee | null> {
        return await this.prisma.employee.findFirst({
            where: {
                pkiId: id,
                fiIsActive: true
            }
        })
    }
    async create(employee: Employee, createdBy: number): Promise<employee> {
        return await this.prisma.employee.create({
            data: {
                ...employee,
                fkiCreatedBy: createdBy
            }
        })
    }
    async update(employee: Employee, createdBy: number): Promise<employee> {
        return await this.prisma.employee.update({
            data: {
                ...employee,
                fkiCreatedBy: createdBy
            },
            where: {
                pkiId: employee.pkiId
            }
        })
    }
    async delete(id: number): Promise<employee> {
        return await this.prisma.employee.delete({
            where: {
                pkiId: id
            }
        })
    }

}
