import { User } from './user';

export interface Recipient {
    fkiId?: number;
    fcDescription: string;
    fdCreatedAt: Date;
    fkiCreatedBy: User;
    fiIsActive: boolean;
}
