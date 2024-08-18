import {action, makeAutoObservable} from "mobx"
import {DELETE, GET, POST} from "@/lib/fetcher";
import {delete_cookie, getCookieUserDetails, getUserToken, signInUser} from "@/lib/users";
import dayjs from "dayjs";
import {notification} from "antd";

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
    openForgotPasswordModal: boolean = false;
    createUserLoading: boolean = false;

    setCreateUserLoading = action((value: boolean) => {
        this.createUserLoading = value;
    })

    setOpenForgotPasswordModal = action((value: boolean) => {
        this.openForgotPasswordModal = value;
    })

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

    loginUser = action(async (values: any) => {
        this.setLoading(true);
        try {
            const response = await POST("/api/login", values);
            signInUser({
                token: response.response.data.token,
                email: response.response.data.email,
                role: response.response.data.role,
                user_name: response.response.data.user_name,
            });
            this.setOpenLoginModal(false);
            return response;
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false);
        }
    });


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
        this.setLoading(true)
        const token = getUserToken();
        await GET(`/api/users?token=${token}`).then(response => {
            this.setAllUsers(response.response.data.map(usersMapper))
        }).finally(() => this.setLoading(false))
    })
    getUserProfile = action(async () => {
        const user = getCookieUserDetails()

        return await GET(`/api/get_user?token=${user.user.token}`).then(response => {
            this.setUserProfileDetails(response.response)
        }).finally(() => {
            this.setLoading(false)
        })
    })

    createUser = action(async (values: any) => {
        this.setCreateUserLoading(true)
        try{
            const token = getUserToken();
            const response = await POST(`/api/user?token=${token}`,values);
            this.allUsers = [...this.allUsers,usersMapper(response.response.data)]

            return response;
        }catch (e){
            throw e
        }
        finally {
            this.setCreateUserLoading(false)
        }
    })

    deleteUsers = action(async (userIds: number[]) => {
        try{
            const response = await DELETE(`/api/users?userIds=${userIds}`)
            this.allUsers = this.allUsers.filter(user => !userIds.includes(user.id))

            return response;
        }catch (e){
            throw e;
        }
    })
}
const usersMapper = (value: User) => {
    const user: User = {
        id: value.id,
        first_name: value.first_name,
        second_name: value.second_name,
        last_name: value.last_name,
        is_active: value.is_active,
        role: value.role,
        email: value.email,
        created_at: dayjs(value.created_at, "YYYY-MM-DD HH:mm").toDate(),
    }

    return user;
}
export default UserStore;