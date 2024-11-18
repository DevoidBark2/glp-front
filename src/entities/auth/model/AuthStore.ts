import { changePassword } from "@/shared/api/auth";
import { ChnagePasswordType } from "@/shared/api/auth/model";
import { notification } from "antd";
import { action, makeAutoObservable } from "mobx";

class AuthStore {
    constructor() {
        makeAutoObservable(this)
    }


    changePassword = action(async (values: ChnagePasswordType) => {
        try {
            const { confirmNewPassword, ...passwordData } = values;
            const data = await changePassword(passwordData);
            notification.success({ message: data.message })
        } catch (e: any) {
            notification.error({ message: e.response.data.message })
        }
    })
}


export default AuthStore;