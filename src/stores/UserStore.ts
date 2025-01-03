import { action, makeAutoObservable } from "mobx"
import { DELETE, GET, POST } from "@/lib/fetcher";
import { delete_cookie, getUserToken, signInUser } from "@/lib/users";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { message } from "antd";
import { StatusUserEnum, User, UserRole } from "@/shared/api/user/model";
import { getUserById, handleBlockUser, updateRole } from "@/shared/api/user";
import { UserProfile } from "./UserProfileStore";
import {login, oauthByProvider, register} from "@/shared/api/auth";

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
        await GET(`/api/search-users?query=${this.searchUserText}`).then(response => {
            this.allUsers = response.data.map(usersMapper);
        }).finally(() => {
            this.setLoadingSearchUser(false)
        })
    })

    submitSelectedAction = action(async () => {
        const token = getUserToken();

        if (this.selectedRowsUser.length < 1) {
            message.warning("Выберите пользователей!")
            return;
        }

        if (!this.selectedGroupAction) {
            message.warning("Выберите групповое действие!")
            return;
        }

        await POST(`/api/global-action?token=${token}`,
            {
                action: this.selectedGroupAction,
                usersIds: this.selectedRowsUser
            }).then(response => {
                this.allUsers = this.allUsers.map((user) => {
                    if (this.selectedRowsUser.includes(user.id)) {
                        return {
                            ...user,
                            status: this.getNewStatusBasedOnAction(this.selectedGroupAction!),
                        };
                    }
                    return user;
                });
                this.selectedRowsUser = []
                this.setSelectedGroupAction(null)
            }).catch(e => { })
    })

    getNewStatusBasedOnAction(action: string) {
        switch (action) {
            case 'activate':
                return StatusUserEnum.ACTIVATED;
            case 'deactivated':
                return StatusUserEnum.DEACTIVATED;
            case 'deleted':
                return StatusUserEnum.DELETED;
            case 'blocked':
                return StatusUserEnum.BLOCKED;
            default:
                return StatusUserEnum.ACTIVATED; // По умолчанию
        }
    }

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
        // return await POST("/api/register", { reqBody: values }).then(response => {
        //     return response
        // }).finally(() => {
        //     this.setLoading(false)
        // })
    })

    logout = action(async () => {
        delete_cookie();
    })

    sendEmailForgotPassword = action(async (values: any) => {

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

    deleteUsers = action(async (id: number) => {
        try {
            const response = await DELETE(`/api/users?id=${id}`)
            this.allUsers = this.allUsers.filter(user => id !== user.id)

            return response;
        } catch (e) {
            throw e;
        }
    })

    getUserById = action(async (userId: number): Promise<User> => {
        return await getUserById(userId);
    })

    updateUserRole = action(async (userId: number, role: UserRole) => {
        return await updateRole({ userId: userId, role: role });
    })

    blockUser = action(async (id: number, status: StatusUserEnum) => {
        return await handleBlockUser({ userId: id, status: status });
    })
}
const usersMapper = (value: User) => {
    const user: User = {
        id: value.id,
        first_name: value.first_name,
        second_name: value.second_name,
        last_name: value.last_name,
        status: value.status,
        phone: value.phone,
        role: value.role,
        email: value.email,
        created_at: dayjs(value.created_at, FORMAT_VIEW_DATE).toDate(),
        about_me: value.about_me,
        birth_day: value.birth_day,
        courses: value.courses,
        posts: value.posts,
        city: value.city,
        profile_url: value.profile_url,
        isVerified: value.isVerified
    }

    return user;
}
export default UserStore;