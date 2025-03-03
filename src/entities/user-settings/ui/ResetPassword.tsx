import { Button, Divider, Form, Input, Tooltip } from "antd";
import React, { FC } from "react";
import { AuthMethodEnum, ChangePasswordType } from "@/shared/api/auth/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";

interface ChangePasswordProps {
    handleChangePassword: (values: ChangePasswordType) => void
}

export const ResetPassword: FC<ChangePasswordProps> = observer(({ handleChangePassword }) => {
    const { userProfileStore } = useMobxStores()
    const [form] = Form.useForm<ChangePasswordType>();
    const { resolvedTheme } = useTheme()

    return <div>
        <h3 className="text-lg font-semibold dark:text-white">Смена пароля</h3>
        <Divider style={{ borderColor: resolvedTheme === "dark" ? "white" : "gray" }} />
        <div className="space-y-4 w-1/2 max-sm:w-full">
            <Form
                form={form}
                layout="vertical"
                style={{ width: "100%" }}
                onFinish={handleChangePassword}
            >
                <Form.Item
                    name="currentPassword"
                    label={<label className="dark:text-white">Текущий пароль</label>}
                    rules={[
                        { required: true, message: 'Введите текущий пароль' },
                    ]}
                >
                    <Input.Password placeholder="Текущий пароль" disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={<label className="dark:text-white">Новый пароль</label>}
                    rules={[
                        { required: true, message: 'Введите новый пароль' }
                    ]}
                >
                    <Input.Password placeholder="Новый пароль" disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS} />
                </Form.Item>

                <Form.Item
                    name="confirmNewPassword"
                    label={<label className="dark:text-white">Подтвердите новый пароль</label>}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Подтвердите новый пароль' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Подтвердите новый пароль" disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS} />
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
                            htmlType="submit"
                            color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                            disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}
                            className="mt-2"
                        >
                            Сохранить
                        </Button>
                    </Tooltip>
                </Form.Item>
            </Form>
        </div>
    </div>
})