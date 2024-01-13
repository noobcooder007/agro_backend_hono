import { User } from './user';

export interface Employee {
    pkiId?: number;
    fcFirstname: string;
    fcFirstLastname: string;
    fcSecondLastname: string;
    fdBirthday: Date;
    fdCreatedAt: Date;
    fkiCreatedBy: User;
    fiIsActive: boolean;
}
