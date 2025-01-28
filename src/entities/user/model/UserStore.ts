import { action, makeAutoObservable } from "mobx"
import { DELETE, GET, POST } from "@/lib/fetcher";
import dayjs from "dayjs";
import { StatusUserEnum, User, UserRole } from "@/shared/api/user/model";
import { getUserById, handleBlockUser, searchUsers, updateRole } from "@/shared/api/user";
import { login, logoutUser, oauthByProvider, register } from "@/shared/api/auth";
import { UserProfile } from "@/stores/UserProfileStore";
import { usersMapper } from "../mappers";

class UserStore {
    constructor() {
        makeAutoObservable(this, {});
    }

    allUsers: User[] = [];
    loading: boolean = false;
    openLeaveCourseModal: boolean = false;
    openLoginModal: boolean = false;
    openRegisterModal: boolean = false;
    openForgotPasswordModal: boolean = false;
    createUserLoading: boolean = false;
    searchUserText: string = ""
    loadingSearchUser: boolean = false;
    selectedGroupAction: StatusUserEnum | null = null;
    selectedRowsUser: number[] = []
    userProfile: UserProfile | null = null;

    setUserProfile = action(async (value: UserProfile) => {
        this.userProfile = value;
    })

    setSelectedRowsUsers = action((value: number[]) => {
        this.selectedRowsUser = value;
    })

    setSelectedGroupAction = action((value: StatusUserEnum | null) => {
        this.selectedGroupAction = value;
    })

    setLoadingSearchUser = action((value: boolean) => {
        this.loadingSearchUser = value;
    })

    setSearchUserText = action((value: string) => {
        this.searchUserText = value;
        this.searchUsers();
    })

    searchUsers = action(async () => {
        this.setLoadingSearchUser(true)

        await searchUsers(this.searchUserText).then(response => {
            this.allUsers = response.map(usersMapper);
        }).finally(() => {
            this.setLoadingSearchUser(false)
        })
    })

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

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    userEditModal: boolean = false;
    setUserEditModal = action((value: boolean) => {
        this.userEditModal = value;
    })

    loginUser = action(async (values: any) => {
        this.setLoading(true);
        try {
            return await login(values);
            // const settingUser = {
            //     pagination_size: response.response.data.pagination_size,
            //     table_size: response.response.data.pagination_size,
            //     show_footer_table: response.response.data.pagination_size,
            //     footerContent: response.response.data.pagination_size
            // }

            // window.localStorage.setItem('user_settings', JSON.stringify(settingUser));
            // this.setUserProfile(response.response.data);
            // signInUser({
            //     id: response.response.data.id,
            //     token: response.response.data.token,
            //     email: response.response.data.email,
            //     role: response.response.data.role,
            //     userAvatar: response.response.data.userAvatar,
            //     user_name: response.response.data.user_name,
            // });
            // this.setOpenLoginModal(false);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false);

        }
    });

    oauthByProvider = action(async (provider: 'google' | 'yandex') => {
        return oauthByProvider(provider)
    })

    registerUser = action(async (values: any) => {
        this.setLoading(true)
        return await register(values).finally(() => {
            this.setLoading(false)
        });
    })

    logout = action(async () => {
        // delete_cookie();
        return await logoutUser();
    })

    setAllUsers = action((values: User[]) => {
        this.allUsers = values;
    })

    getUsers = action(async () => {
        this.setLoading(true)
        await GET(`/api/users`).then(response => {
            this.setAllUsers(response.response.data.map(usersMapper))
        }).finally(() => this.setLoading(false))
    })

    createUser = action(async (values: any) => {
        this.setCreateUserLoading(true)
        try {
            const response = await POST(`/api/user`, values);
            this.allUsers = [...this.allUsers, usersMapper(response)]

            return response;
        } catch (e) {
            throw e
        }
        finally {
            this.setCreateUserLoading(false)
        }
    })

    deleteUsers = action(async (id: string) => {
        try {
            const response = await DELETE(`/api/users?id=${id}`)
            this.allUsers = this.allUsers.filter(user => id !== user.id)

            return response;
        } catch (e) {
            throw e;
        }
    })

    getUserById = action(async (userId: string): Promise<User> => {
        return await getUserById(userId);
    })

    updateUserRole = action(async (userId: number, role: UserRole) => {
        return await updateRole({ userId: userId, role: role });
    })

    blockUser = action(async (id: number, status: StatusUserEnum) => {
        return await handleBlockUser({ userId: id, status: status });
    })
}

export default UserStore;