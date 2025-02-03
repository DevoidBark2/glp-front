"use client"
import React from "react";
import { ChangePasswordType } from "@/shared/api/auth/model";
import {Form, notification, Tabs, TabsProps} from "antd";
import {observer} from "mobx-react";
import {ResetPassword} from "@/entities/user-settings/ui/ResetPassword";
import {ManageProfile} from "@/entities/user-settings/ui/ManageProfile";
import {useRouter} from "next/navigation";
import {useMobxStores} from "@/shared/store/RootStore";

const SettingsPage = observer(() => {
    const {authStore, userProfileStore} = useMobxStores()
    const [form] = Form.useForm<ChangePasswordType>();
    const router = useRouter()

    const handleChangePassword = (values:ChangePasswordType) => {
        authStore.changePassword(values).then((response) => {
            notification.success({message: response.message})
            form.resetFields();
        }).catch(e => {
            notification.error({message: e.response.data.message})
        });
    };

    const handleDeleteAccount = () => {
        authStore.deleteAccount().then(() => {
            userProfileStore.setUserProfile(null);
            router.push("/platform");
        })
    }

    const items: TabsProps['items'] = [
        {
            key: "1",
            label: "Безопасность",
            children: ( <ResetPassword handleChangePassword={handleChangePassword}/>),
        },
        {
            key: "2",
            label: "Управление аккаунтом",
            children: (<ManageProfile handleDeleteAccount={handleDeleteAccount} />),
        },
    ];

    return(
        <div className="container mx-auto">
            <h1 className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Настройки</h1>
            <Tabs items={items} />
        </div>
    )
})

export default SettingsPage;