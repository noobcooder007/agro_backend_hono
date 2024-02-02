import { employee } from '@prisma/client'
import { Employee } from '../../entities/employee';

export abstract class EmployeeRepository {
    abstract findMany(): Promise<employee[] | null>
    abstract findManyActives(): Promise<employee[] | null>
    abstract findFirst(id: number): Promise<employee | null>
    abstract create(employee: Employee, createdBy: number): Promise<employee>
    abstract update(employee: Employee, createdBy: number): Promise<employee>
    abstract delete(id: number): Promise<employee>
}