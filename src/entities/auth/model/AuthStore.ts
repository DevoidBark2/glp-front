import { changePassword } from "@/shared/api/auth";
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
}


export default AuthStore;