import {action, makeAutoObservable} from "mobx";
import {ComplexityPasswordEnum} from "@/enums/ComplexityPasswordEnum";
import {UserRole} from "@/enums/UserRoleEnum";
import {GET, POST} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";
import {notification} from "antd";

type GeneralSettingsType = {
    id: number;
    platform_name: string;
    logo_url: string;
    service_mode: boolean;
    cache_enabled: boolean;
    min_password_length: number;
    password_complexity: ComplexityPasswordEnum;
    default_user_role: UserRole;
    auto_confirm_register: boolean;
    user_complaint_notification: boolean;
    period_of_inactive: number;
    auto_publish_course: boolean;
    max_upload_file_size: number;
    moderation_review_course: boolean;
    moderation_new_course: boolean;
}

export class GeneralSettings {
    constructor() {
        makeAutoObservable(this)
    }

    loading: boolean = false;

    setLoading = action((value: boolean) => {
        this.loading = value;
    })

    getGeneralSettings = action(async () => {
        this.setLoading(true)
        const token = getUserToken();
        return await GET(`/api/general-settings?token=${token}`);
    })

    saveGeneralSetting = action(async (settings: GeneralSettingsType) => {
        const token = getUserToken();
        await POST(`/api/general-settings?token=${token}`, settings).then(response => {
            notification.success({message:response.response.data.message})
        })
    })
}