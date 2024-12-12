import { action, makeAutoObservable } from "mobx";
import { GET, POST } from "@/lib/fetcher";
import { notification } from "antd";
import {GeneralSettingsType} from "@/shared/api/general-settings";

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
           const response = await GET(`/api/general-settings`)
           this.setGeneralSetting(response.data[0])
           return response[0]?.service_mode
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
        await POST(`/api/general-settings`, formData).then(response => {
            notification.success({ message: response.data.message });
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    });
}