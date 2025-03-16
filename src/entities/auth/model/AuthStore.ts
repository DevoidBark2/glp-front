import { action, makeAutoObservable } from "mobx";

import {
    changePassword,
    deleteUserAccount,
    logoutUser,
    newPassword,
    resetPassword,
    verificationEmail
} from "@/shared/api/auth";
import { ChangePasswordType } from "@/shared/api/auth/model";

class AuthStore {
    constructor() {
        makeAutoObservable(this)
    }

    changePassword = action(async (values: ChangePasswordType) => {
        const { confirmNewPassword, ...passwordData } = values;
        return await changePassword(passwordData);
    })

    resetPassword = action(async (email: string) => await resetPassword(email))

    newPassword = action(async (password: string, token: string | null) => await newPassword(password, token))

    verification = action(async (token: string | null) => await verificationEmail(token))

    deleteAccount = action(async () => await deleteUserAccount())
}


export default AuthStore;