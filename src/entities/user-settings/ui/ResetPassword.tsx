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
            style={{width:"100%"}}
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
                    <button
                        type="submit"
                        disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}
                        className="px-6 py-3 border-2 border-yellow-400 text-yellow-300 font-bold text-lg uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-transparent hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-md clip-cyber"
                        onClick={() => {
                        }} // Звук при успешном сохранении
                    >
                        Сохранить новый пароль
                    </button>
                    {/*<Button*/}
                    {/*    type="primary"*/}
                    {/*    htmlType="submit"*/}
                    {/*    disabled={userProfileStore.userProfile?.method_auth !== AuthMethodEnum.CREDENTIALS}*/}
                    {/*>*/}
                    {/*    */}
                    {/*</Button>*/}
                </Tooltip>
            </Form.Item>
        </Form>
    </div>
})