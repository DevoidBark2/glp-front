import { GET, POST } from "@/lib/fetcher";
import { notification, UploadFile } from "antd";
import { action, makeAutoObservable } from "mobx";

type UserProfile = {
    birth_day: Date
    city: string
    first_name: string
    id: number
    last_name: string
    second_name: string
    university: string
}

type FeedBackItem = {

}

class UserProfileStore {
    constructor() {
        makeAutoObservable(this);
    }

    fileListForFeedback: UploadFile[] = [];
    loading: boolean = false;

    setFileForFeedBack = action((files: UploadFile[]) => {
        this.fileListForFeedback = files;
    });

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    getUserProfile = action(async () => {
        this.setLoading(true)
        return await GET(`/api/get-user`)  // this.setUserProfileDetails()
            .finally(() => {
                this.setLoading(false)
            })
    })


}

export default UserProfileStore