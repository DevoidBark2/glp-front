import {action, makeAutoObservable} from "mobx"
import {GET, POST} from "@/lib/fetcher";
import {notification} from "antd";
import {delete_cookie, getCookieUserDetails, signInUser} from "@/lib/users";

type userProfile = {
    birth_day : Date
    city: string
    first_name: string
    id: number
    last_name: string
    second_name:string
    university: string
}
class UserStore {
    constructor(){
        makeAutoObservable(this, {});
    }

    loading: boolean = false;

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    userEditModal: boolean = false;
    setUserEditModal = action((value:boolean) => {
        this.userEditModal = value;
    })

    loginUser = action(async(values:any) => {
        this.setLoading(true)
        await POST("/api/login",values).then(response => {
            debugger
            //сохранение в куки данные пользователя
            signInUser({
                token: response.response.token,
                email: response.response.email,
                role: response.response.role,
                user_name: response.response.user_name
            })
        }).finally(() => {
            this.setLoading(false)
        })
    })

    registerSuccess: boolean = false;

    setRegisterSuccess = action((value: boolean) => {
        this.registerSuccess = value;
    })

    registerUser = action(async (values: any) => {
        this.setLoading(true)
        await POST("/api/register",{reqBody: values}).then(response => {
            this.setRegisterSuccess(true);
        }).finally(() => {
            this.setLoading(false)
        })
    })

    logout = action(async () => {
        delete_cookie()
    })

    sendEmailForgotPassword = action(async (values:any) => {

    })

    userProfileDetails: userProfile | null = null

    setUserProfileDetails = action((value:any) => {
        this.userProfileDetails = value
    })

    getUserProfile = action(async () => {
        this.setLoading(true)
        const user = getCookieUserDetails()

        await GET(`/api/get_user?token=${user.user.token}`).then(response => {
            this.setUserProfileDetails(response.response)
        })
    })
}

export default UserStore;