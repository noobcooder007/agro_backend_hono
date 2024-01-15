import { user } from '@prisma/client'

import { User } from '../../../domain/entities/user'
import { UserDatasource } from '../../../domain/datasources/auth/user_datasource'
import { UserRepository } from '../../../domain/repositories/auth/user_repository'

export class IUserRepository implements UserRepository {
    private userDatasource: UserDatasource

    constructor(userDatasource: UserDatasource) {
        this.userDatasource = userDatasource
    }
    
    async findFirst(fcUsername: string): Promise<user | null> {
        return await this.userDatasource.findFirst(fcUsername)
    }

    async create(user: User): Promise<user | null> {
        return await this.userDatasource.create(user)
    }

}