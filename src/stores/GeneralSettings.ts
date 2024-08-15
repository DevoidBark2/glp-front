import {action, makeAutoObservable} from "mobx";
import {ComplexityPasswordEnum} from "@/enums/ComplexityPasswordEnum";
import {UserRole} from "@/enums/UserRoleEnum";
import {GET} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";

type GeneralSettingsType = {
    id: number;
    min_password_length: number;
    password_complexity: ComplexityPasswordEnum;
    default_user_role: UserRole;
}

export class GeneralSettings {
    constructor() {
        makeAutoObservable(this)
    }

    generalSettings: GeneralSettingsType | null = null

    getGeneralSettings = action(async () => {
        const token = getUserToken();
        return await GET(`/api/general-settings?token=${token}`);
    })

    saveGeneralSetting = action(async (values:any) => {
    })
}