import { GET, POST, PUT } from "@/lib/fetcher";
import { notification, UploadFile } from "antd";
import { action, makeAutoObservable } from "mobx";

type UserProfile = {
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

    setFileForFeedBack = action((files: UploadFile[]) => {
        this.fileListForFeedback = files;
    });

    setSaveProfile = action((value: boolean) => {
        this.saveProfile = value;
    })

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    getUserProfile = action(async () => {
        this.setLoading(true)
        return await GET(`/api/get-user`)
    })

    updateProfile = action(async (values:UserProfile) => {
        debugger
        window.localStorage.setItem('user_settings',JSON.stringify(values))
        this.setSaveProfile(true)
        await PUT('/api/profile', values).then(response => {
            notification.success({message: response.message})
        }).catch(e => {
        }).finally(() => {
            this.setSaveProfile(false)
        })
    })

    uploadAvatar = action(async (file: File) => {
        const form = new FormData();
        form.append('logo_avatar', file)
        return await PUT('/api/upload-avatar', form);
    })

}

export default UserProfileStore