import {action, makeAutoObservable} from "mobx";
import {ValueType} from "tailwindcss/types/config";
import {GET, PUT} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";
import {notification} from "antd";
import {ColorValueType} from "antd/es/color-picker/interface";

type UserSettings = {
    border_vertex: ColorValueType;
    edge_color: ColorValueType;
    type_vertex: string
    vertex_color: ColorValueType
}
class SettingsStore{
    constructor() {
        makeAutoObservable(this)
    }

    loading: boolean = false;

    setLoading = action((value: boolean) => {
        this.loading = value;
    })

    userSettings: UserSettings | null = null

    setUserSettings = action((value:UserSettings) => {
        this.userSettings = value;
    })
    getUserSettings = action(async () => {
        this.setLoading(true)
        const token = getUserToken();

        await GET(`/api/user-settings?token=${token}`).then((response) => {
            const userSettings = response.response.userSettings as UserSettings;
            this.setUserSettings(userSettings);
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    })

    changeSetting = action(async () => {

        const changeUserSettings = this.userSettings;
        const token = getUserToken();
        debugger

        await PUT(`/api/user-settings?token=${token}`,{changeUserSettings: changeUserSettings}).then(response => {
            notification.success({message:response.response.message})
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })

    })
}

export default SettingsStore;