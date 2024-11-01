export enum UserRole {
    SUPER_ADMIN = 'superadmin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    MODERATOR = 'moderator',
}

export enum StatusUserEnum {
    ACTIVATED = "active",
    DEACTIVATED = "deactivated",
    BLOCKED = "blocked",
    DELETED = "deleted",
}

export type User = {
    id: number;
    first_name: string;
    second_name: string;
    last_name: string;
    phone: string;
    role: UserRole;
    status: StatusUserEnum;
    email: string;
    created_at: Date;
}