import { UserRole } from "@/shared/api/user/model";

export const IsAdmin = (userRole: UserRole) => userRole === UserRole.SUPER_ADMIN
export const IsTeacher = (userRole: UserRole) => userRole === UserRole.TEACHER
export const IsStudent = (userRole: UserRole) => userRole === UserRole.STUDENT