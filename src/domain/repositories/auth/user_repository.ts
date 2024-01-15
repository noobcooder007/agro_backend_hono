import { user } from '@prisma/client'

import { User } from '../../entities/user'

export abstract class UserRepository {
    abstract findFirst(fcUsername: string): Promise<user | null>
    abstract create(user: User): Promise<user | null>
}
