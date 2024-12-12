"use client"
import React from "react";
import { ChangePasswordType } from "@/shared/api/auth/model";
import { useMobxStores } from "@/shared/store/RootStore";
import {Form, notification, Tabs, TabsProps} from "antd";
import {observer} from "mobx-react";
import {ResetPassword} from "@/entities/user-settings/ui/ResetPassword";

const SettingsPage = () => {
    const {authStore} = useMobxStores()
    const [form] = Form.useForm<ChangePasswordType>();

    const handleChangePassword = (values:ChangePasswordType) => {
        authStore.changePassword(values).then((response) => {
            notification.success({message: response.message})
            form.resetFields();
        }).catch(e => {
            notification.error({message: e.response.data.message})
        });
    };

    
    const items: TabsProps['items'] = [
        {
          key: "1",
          label: "Безопасность",
          children: (
            <div className="space-y-4 w-1/3">
              <h3 className="text-lg font-semibold">Изменить пароль</h3>
                <ResetPassword handleChangePassword={handleChangePassword}/>
            </div>
          ),
        },
      ];

    return(
        <div className="container mx-auto">
            <h1 className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Настройки</h1>
            <Tabs items={items} />
        </div>
    )
}

export default observer(SettingsPage);