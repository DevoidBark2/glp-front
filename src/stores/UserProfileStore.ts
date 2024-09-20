import { GET,POST } from "@/lib/fetcher";
import { notification, UploadFile } from "antd";
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

type FeedBackItem =  {

}

class UserProfileStore {
    constructor() {
        makeAutoObservable(this);
    }

    fileListForFeedback: UploadFile[] = [];
    userProfileDetails: UserProfile | null = null
    loading: boolean = false;
    
    setFileForFeedBack = action((files: UploadFile[]) => {
        this.fileListForFeedback = files;
    });

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


}

export default UserProfileStore