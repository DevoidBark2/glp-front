import {action, makeAutoObservable} from "mobx"
import {GET, POST} from "@/lib/fetcher";
import {delete_cookie, getCookieUserDetails, getUserToken, signInUser} from "@/lib/users";
import dayjs from "dayjs";

type userProfile = {
    birth_day : Date
    city: string
    first_name: string
    id: number
    last_name: string
    second_name:string
    university: string
}

export type User = {
    id: number;
    first_name: string;
    second_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    email: string;
    created_at: Date;
}
class UserStore {
    constructor(){
        makeAutoObservable(this, {});
    }

    allUsers: User[] = [];
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

    setAllUsers = action((values: User[]) => {
        this.allUsers = values;
    })

    getUsers = action(async () => {
        const token = getUserToken();
        await GET(`/api/users?token=${token}`).then(response => {
            this.setAllUsers(response.response.data.map(usersMapper))
        })
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
const usersMapper = (value: User) => {
    return {
        id: value.id,
        first_name: value.first_name,
        second_name: value.second_name,
        last_name: value.last_name,
        is_active: value.is_active,
        role: value.role,
        email: value.email,
        createdAt: dayjs(value.created_at).format("YYYY-MM-DD HH:mm"),
    }
}
export default UserStore;