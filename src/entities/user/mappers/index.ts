import { User } from "@/shared/api/user/model";

export const usersMapper = (value: User) => {
    const user: User = {
        id: value.id,
        first_name: value.first_name,
        second_name: value.second_name,
        last_name: value.last_name,
        status: value.status,
        phone: value.phone,
        role: value.role,
        email: value.email,
        created_at: value.created_at,
        about_me: value.about_me,
        birth_day: value.birth_day,
        courses: value.courses,
        posts: value.posts,
        city: value.city,
        method_auth: value.method_auth,
        profile_url: value.profile_url,
        isVerified: value.isVerified
    }

    return user;
}