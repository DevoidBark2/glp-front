import {action, makeAutoObservable} from "mobx";
import {notification} from "antd";
import {GeneralSettingsType} from "@/shared/api/general-settings/model";
import {changeGeneralSettings, getGeneralSettings} from "@/shared/api/general-settings";

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
       try {
           this.setLoading(true);
           return await getGeneralSettings().then(response => {
               this.setGeneralSetting(response.data[0])
           })
       }finally {
           this.setLoading(false);
       }
    })

    saveGeneralSetting = action(async (values: any) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === "logo_url") {
                // @ts-ignore
                formData.append(key, value.file as any);
            }
            // @ts-ignore
            formData.append(key, value);
        })
        await changeGeneralSettings(formData).then(response => {
            notification.success({ message: response.data.message });
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    });
}