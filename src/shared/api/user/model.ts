import { Course } from "../course/model";
import { Post } from "../posts/model";

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
    city: string;
    profile_url: string;
    status: StatusUserEnum;
    email: string;
    birth_day: Date;
    about_me: string;
    created_at: Date;
    courses: Course[];
    posts: Post[]
    isVerified: boolean
}