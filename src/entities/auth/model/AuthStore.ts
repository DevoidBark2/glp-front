import {
    changePassword,
    deleteUserAccount,
    logoutUser,
    newPassword,
    resetPassword,
    verificationEmail
} from "@/shared/api/auth";
import { ChangePasswordType } from "@/shared/api/auth/model";
import { action, makeAutoObservable } from "mobx";

class AuthStore {
    constructor() {
        makeAutoObservable(this)
    }

    changePassword = action(async (values: ChangePasswordType) => {
        const { confirmNewPassword, ...passwordData } = values;
        return await changePassword(passwordData);
    })

    resetPassword = action(async (email: string) => {
        return await resetPassword(email)
    })

    newPassword = action(async (password: string, token: string | null) => {
        return await newPassword(password, token);
    })

    verification = action(async (token: string | null) => {
        return await verificationEmail(token)
    })

    deleteAccount = action(async () => {
        return await deleteUserAccount();
    })
}


export default AuthStore;