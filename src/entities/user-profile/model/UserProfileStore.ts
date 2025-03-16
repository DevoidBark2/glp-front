import { notification, UploadFile } from "antd";
import { action, makeAutoObservable } from "mobx";

import { confirmLeaveCourse } from "@/shared/api/course";
import { Course } from "@/shared/api/course/model";
import { getUserProfile, updateProfile, uploadProfileAvatar } from "@/shared/api/user";
import nextConfig from "next.config.mjs";
import { UserRole } from "@/shared/api/user/model";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import { UserLevel } from "@/shared/api/users-level/model";

export type UserProfile = {
    id: string
    first_name: string
    last_name: string
    second_name: string
    phone: string
    email: string;
    birth_day: Date
    role: UserRole;
    city: string;
    about_me: string;
    image: string;
    user_name: string;
    pagination_size: number;
    settings_control_panel: boolean;
    is_two_factor_enabled: boolean;
    method_auth: AuthMethodEnum
    userLevel: UserLevel,
    coins: number,
    activeCustomization: any
    created_at: Date;
}

class UserProfileStore {
    constructor() {
        makeAutoObservable(this);
    }

    fileListForFeedback: UploadFile[] = [];
    loading: boolean = false;
    saveProfile: boolean = false;
    userProfile: UserProfile | null = null;
    userAvatar: string | null = "";
    userProfileCourses: Course[] = [];

    uploadingProfileImage: boolean = false;

    setUploadingProfileImage = action((value: boolean) => {
        this.uploadingProfileImage = value;
    });

    setUserAvatar = action((value: string) => {
        this.userAvatar = value ? `${nextConfig.env?.API_URL}${value}` : null;
    })

    confirmLeaveCourse = action(async (courseId: number) => {
        await confirmLeaveCourse(courseId);
        this.userProfileCourses = this.userProfileCourses.filter(it => it.id !== courseId);
    })

    setFileForFeedBack = action((files: UploadFile[]) => {
        this.fileListForFeedback = files;
    });

    setUserProfile = action((value: UserProfile | null) => {
        this.userProfile = value;
    })

    setSaveProfile = action((value: boolean) => {
        this.saveProfile = value;
    })

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    setUserProfileCourses = action((courses: Course[]) => {
        this.userProfileCourses = courses
    })

    getUserProfile = action(async () => {
        this.setLoading(true);
        const response = await getUserProfile();
        this.setUserProfileCourses(response.userCourses);
        this.setUserAvatar(response.image);
        this.setUserProfile(response);
        return response;
    });

    updateProfile = action(async (values: UserProfile) => {
        this.setSaveProfile(true);

        const { settings_control_panel, ...cleanedValues } = values;
        if (settings_control_panel) {
            window.localStorage.setItem('user_settings', JSON.stringify(values));
        }

        await updateProfile(cleanedValues as UserProfile)
            .then(response => {
                const updatedProfile = { ...this.userProfile, ...cleanedValues };
                this.setUserProfile(updatedProfile as UserProfile);
                notification.success({ message: response.message })
                return response;
            })
            .catch(e => {
                console.error("Ошибка при обновлении профиля:", e);
            })
            .finally(() => {
                this.setSaveProfile(false);
            });
    });


    uploadAvatar = action(async (file: File) => {
        const form = new FormData();
        form.append('logo_avatar', file)
        const data = await uploadProfileAvatar(form);
        const updatedProfile = { ...this.userProfile, image: data.data };
        this.setUserProfile(updatedProfile as UserProfile);
        return data
    })

}

export default UserProfileStore