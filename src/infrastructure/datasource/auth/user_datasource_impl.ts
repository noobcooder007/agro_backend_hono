import { PrismaClient, user } from '@prisma/client'

import { User } from '../../../domain/entities/user'
import { UserDatasource } from '../../../domain/datasources/auth/user_datasource'

export class IUserDatasource implements UserDatasource {
    
    private prisma = new PrismaClient();
    
    async findFirst(fcUsername: string): Promise<user | null> {
        return await this.prisma.user.findFirst({
            where: {
                fcUsername
            }
        })
    }
    
    async create(user: User): Promise<user | null> {
        return await this.prisma.user.create({
            data: {
                ...user
            }
        })
    }
}
