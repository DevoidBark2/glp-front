import { GET, POST, PUT } from "@/lib/fetcher";
import { confirmLeaveCourse } from "@/shared/api/course";
import { Course } from "@/shared/api/course/model";
import { notification, UploadFile } from "antd";
import { action, makeAutoObservable } from "mobx";
import nextConfig from "next.config.mjs";

export type UserProfile = {
    first_name: string
    last_name: string
    second_name: string
    phone: string
    email: string;
    birth_day: Date
    city: string;
    about_me: string;
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

    setUserAvatar = action((value: string) => {
        this.userAvatar = value ? `${nextConfig.env?.API_URL}${value}` : null;
    })

    confirmLeaveCourse = action(async (courseId: number) => {
        const data = await confirmLeaveCourse(courseId);
        this.userProfileCourses = this.userProfileCourses.filter(it => it.courseId !== courseId);
    })

    setFileForFeedBack = action((files: UploadFile[]) => {
        this.fileListForFeedback = files;
    });

    setUserProfile = action(async (value: UserProfile) => {
        this.userProfile = value;
    })

    setSaveProfile = action((value: boolean) => {
        this.saveProfile = value;
    })

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    setUserProfileCourses = action(async (courses: Course[]) => {
        this.userProfileCourses = courses
    })

    getUserProfile = action(async () => {
        try {

            this.setLoading(true)
            const data = await GET(`/api/get-user`)
            debugger
            this.setUserProfileCourses(data.data.userCourses);
            this.setUserAvatar(data.data.image)
            this.setUserProfile(data.data)
            return data;
        } catch (e) {

        } finally {
            this.setLoading(false)
        }
    })

    updateProfile = action(async (values: UserProfile) => {
        window.localStorage.setItem('user_settings', JSON.stringify(values))
        this.setSaveProfile(true)
        await PUT('/api/profile', values).then(response => {
            notification.success({ message: response.message })
        }).catch(e => {
        }).finally(() => {
            this.setSaveProfile(false)
            this.setUserProfile(values);
        })
    })

    uploadAvatar = action(async (file: File) => {
        const form = new FormData();
        form.append('logo_avatar', file)
        return await PUT('/api/upload-avatar', form);
    })

}

export default UserProfileStore