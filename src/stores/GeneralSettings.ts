import { action, makeAutoObservable } from "mobx";
import { ComplexityPasswordEnum } from "@/enums/ComplexityPasswordEnum";
import { UserRole } from "@/enums/UserRoleEnum";
import { GET, POST } from "@/lib/fetcher";
import { getUserToken } from "@/lib/users";
import { notification } from "antd";

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
    allow_extra_materials: boolean
}

export class GeneralSettings {
    constructor() {
        makeAutoObservable(this)
    }

    loading: boolean = true;
    generalSettings: GeneralSettingsType | null = null;

    setGeneralSetting = action((value: GeneralSettingsType) => {
        this.generalSettings = value;
    })
    setLoading = action((value: boolean) => {
        this.loading = value;
    })

    getGeneralSettings = action(async () => {
     
        const response = await GET(`/api/general-settings`)
        debugger
        this.setGeneralSetting(response.data[0])
        return response;
    })

    saveGeneralSetting = action(async (values:any) => {
        const formData = new FormData();
        debugger
        Object.entries(values).forEach(([key,value]) => {
            debugger
            if(key === "logo_url"){
                debugger
                formData.append(key,value.file);
            }
            formData.append(key,value);
        })
        await POST(`/api/general-settings`, formData).then(response => {
            notification.success({ message: response.data.message });
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    });
}