export type SignUpDto = {
    name: string;
    email: string;
    password: string;
};

export interface LoginDto {
    email: string;
    password: string;
}

export interface SessionUser {
    id: string;
    name: string;
    email: string;
}