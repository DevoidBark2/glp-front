import { GET,POST } from "@/lib/fetcher";
import { getCookieUserDetails } from "@/lib/users";
import { notification } from "antd";
import { action, makeAutoObservable } from "mobx";

type UserProfile = {
    birth_day : Date
    city: string
    first_name: string
    id: number
    last_name: string
    second_name:string
    university: string
}

class UserProfileStore {
    constructor() {
        makeAutoObservable(this);
    }

    userProfileDetails: UserProfile | null = null
    loading: boolean = false;

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    setUserProfileDetails = action((value:any) => {
        this.userProfileDetails = value
    })

    getUserProfile = action(async () => {
        return await GET(`/api/get-user`).then(response => {
            this.setUserProfileDetails(response.data)
        }).finally(() => {
            this.setLoading(false)
        })
    })

    sendFeedback = action(async (message: string) => {
        await POST("/api/send-feedback",{message: message}).then(response => {
            debugger
            notification.success({message: response.message})
        })
    })
}

export default UserProfileStore