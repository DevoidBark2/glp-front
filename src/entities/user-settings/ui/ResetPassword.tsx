import {Button, Form, Input, Tooltip} from "antd";
import React, {FC} from "react";
import {AuthMethodEnum, ChangePasswordType} from "@/shared/api/auth/model";
import {useMobxStores} from "@/shared/store/RootStore";
import {observer} from "mobx-react";

interface ChangePasswordProps {
    handleChangePassword: (values:ChangePasswordType) => void
}

export const ResetPassword: FC<ChangePasswordProps> = observer(({handleChangePassword}) => {
    const { userProfileStore } = useMobxStores()
    const [form] = Form.useForm<ChangePasswordType>();
    return <div className="space-y-4 w-1/3">
        <h3 className="text-lg font-semibold">Изменить пароль</h3>
        <Form
            form={form}
            layout="vertical"
            onFinish={handleChangePassword}
        >
            <Form.Item
                name="currentPassword"
                label="Текущий пароль"
                rules={[
                    {required: true, message: 'Введите текущий пароль'},
                ]}
            >
                <Input.Password placeholder="Текущий пароль" disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}/>
            </Form.Item>

            <Form.Item
                name="newPassword"
                label="Новый пароль"
                rules={[
                    {required: true, message: 'Введите новый пароль'}
                ]}
            >
                <Input.Password placeholder="Новый пароль" disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}/>
            </Form.Item>

            <Form.Item
                name="confirmNewPassword"
                label="Подтвердите новый пароль"
                dependencies={['newPassword']}
                rules={[
                    {required: true, message: 'Подтвердите новый пароль'},
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли не совпадают'));
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Подтвердите новый пароль" disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}/>
            </Form.Item>

            <Form.Item>
                <Tooltip
                    title={
                        userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS
                            ? 'Смена пароля недоступна, так как вы вошли через сторонний сервис'
                            : undefined
                    }
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}
                    >
                        Сохранить новый пароль
                    </Button>
                </Tooltip>
            </Form.Item>
        </Form>
    </div>
})