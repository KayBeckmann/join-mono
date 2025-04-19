export interface User {
    id: number | string;
    name: string;
    email: string;
    password?: string;
    initials?: string;
    picture?: string;
    phone?: string;
    isUser: boolean;
}
