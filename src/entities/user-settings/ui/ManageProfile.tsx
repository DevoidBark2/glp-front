import {Button, Divider, Form, Switch} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/shared/store/RootStore";
import {AuthMethodEnum} from "@/shared/api/auth/model";

interface ManageProfileProps {
    handleDeleteAccount: () => void;
}

export const ManageProfile: React.FC<ManageProfileProps> = ({handleDeleteAccount}) => {
    const [form] = Form.useForm();
    const {userProfileStore} = useMobxStores()

    const handleChangeManageAccount = () => {
        userProfileStore.updateProfile(form.getFieldsValue())
    }

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => {
            userProfileStore.setLoading(false)
        })
    }, [])
    return <div className="space-y-4 w-1/3">
        <h3 className="text-lg font-semibold">Управление аккаунтом</h3>
        <Form
            form={form}
            layout="vertical"
            initialValues={{is_two_factor_enabled: userProfileStore.userProfile?.is_two_factor_enabled}}
            onFieldsChange={handleChangeManageAccount}
        >
            <Form.Item
                name="is_two_factor_enabled"
                label="Двухфакторная авторизация"
                valuePropName="checked"
                tooltip={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS ? `Двухфакторная авторизация не доступна, Вы вошли через сторонний сервис` : undefined}
            >
                <Switch
                    checkedChildren="Вкл"
                    unCheckedChildren="Выкл"
                    disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}
                />
            </Form.Item>

            <Divider/>
        </Form>
        <Button onClick={handleDeleteAccount} type="primary" danger>Удалить аккаунт</Button>
    </div>
}