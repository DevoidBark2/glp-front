import { Button, Form, Switch } from "antd";
import React from "react";
import { observer } from "mobx-react";
import {useTheme} from "next-themes";

import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";

interface ManageProfileProps {
    showDeleteAccountModal: () => void;
}

export const ManageProfile: React.FC<ManageProfileProps> = observer(({ showDeleteAccountModal }) => {
    const [form] = Form.useForm();
    const { userProfileStore } = useMobxStores()
    const {resolvedTheme} = useTheme()

    const handleChangeManageAccount = () => {
        userProfileStore.updateProfile(form.getFieldsValue())
    }

    return <div className="space-y-4 w-full">
        <Form
            form={form}
            layout="vertical"
            initialValues={{ is_two_factor_enabled: userProfileStore.userProfile?.is_two_factor_enabled }}
            onFieldsChange={handleChangeManageAccount}
        >
            <Form.Item
                name="is_two_factor_enabled"
                label={<p className='dark:text-white'>Двухфакторная авторизация</p>}
                valuePropName="checked"
                tooltip={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS ? `Двухфакторная авторизация не доступна, Вы вошли через сторонний сервис` : undefined}
            >
                <Switch
                    checkedChildren={<p style={{color: resolvedTheme === "dark" ? "black": undefined}}>Вкл</p>}
                    unCheckedChildren={<p style={{color: resolvedTheme === "dark" ? "black": undefined}}>Выкл</p>}
                    style={{background: resolvedTheme === "dark" ? "white": undefined}}
                    disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}
                    className={resolvedTheme === "dark" ? "dark-theme-switch" : "light-theme-switch"}
                />
            </Form.Item>

        </Form>
        <Button onClick={showDeleteAccountModal} type="primary" danger>Удалить аккаунт</Button>
    </div>
})