import { user } from '@prisma/client'

import { User } from '../../entities/user'

export abstract class UserDatasource {
    abstract findFirst(fcUsername: string): Promise<user | null>
    abstract create(user: User): Promise<user | null>
}
