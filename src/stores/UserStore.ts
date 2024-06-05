import {action, makeAutoObservable} from "mobx"

class UserStore {
    constructor(){
        makeAutoObservable(this, {});
    }

    loginUser = action(async(values:any) => {
        debugger;
    })

    registerUser = action(async (values: any) => {
        debugger
    })

    sendEmailForgotPassword = action(async (values:any) => {

    })
}

export default UserStore;