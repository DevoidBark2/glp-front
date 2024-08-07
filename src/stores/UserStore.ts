import {action, makeAutoObservable} from "mobx"
import {GET, POST} from "@/lib/fetcher";
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
    openLeaveCourseModal: boolean = false;
    openLoginModal: boolean = false;
    openRegisterModal: boolean = false;

    setOpenLoginModal = action((value: boolean) => {
        this.openLoginModal = value;
    })

    setOpenRegisterModal = action((value: boolean) => {
        this.openRegisterModal = value;
    })

    setOpenLeaveCourseModal = action((value: boolean) => {
        this.openLeaveCourseModal = value;
    })

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
                token: response.response.data.token,
                email: response.response.data.email,
                role: response.response.data.role,
                user_name: response.response.data.user_name
            })
            this.setOpenLoginModal(false)
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

        return await GET(`/api/get_user?token=${user.user.token}`).then(response => {
            this.setUserProfileDetails(response.response)
        }).finally(() => {
            this.setLoading(false)
        })
    })
}

export default UserStore;