import { confirmLeaveCourse } from "@/shared/api/course";
import { Course } from "@/shared/api/course/model";
import { getUserProfile, updateProfile, uploadProfileAvatar } from "@/shared/api/user";
import { notification, UploadFile } from "antd";
import { action, makeAutoObservable } from "mobx";
import nextConfig from "next.config.mjs";
import { UserRole } from "@/shared/api/user/model";

export type UserProfile = {
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
        this.userProfileCourses = this.userProfileCourses.filter(it => it.courseId !== courseId);
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
        window.localStorage.setItem('user_settings', JSON.stringify(values))
        this.setSaveProfile(true)
        await updateProfile(values).then(response => {
            notification.success({ message: response.message })
            const updatedProfile = { ...this.userProfile, ...values };
            this.setUserProfile(updatedProfile);
        }).catch(e => {
        }).finally(() => {
            this.setSaveProfile(false)
        })
    })

    uploadAvatar = action(async (file: File) => {
        const form = new FormData();
        form.append('logo_avatar', file)
        const data = await uploadProfileAvatar(form);
        const updatedProfile = { ...this.userProfile, image: data.data };
        this.setUserProfile(updatedProfile);
        return data
    })

}

export default UserProfileStore