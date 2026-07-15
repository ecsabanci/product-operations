import { Role } from './role.model';

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
}

export type User = Omit<LoginResponse, 'accessToken' | 'refreshToken'> & {
    role: Role;
};