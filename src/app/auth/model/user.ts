export class User {
    Email: string = '';
    Password: string = '';
}

export interface AuthResponse {
    accessToken: string;
}