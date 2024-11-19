"use client"
import React from "react";
import { ChnagePasswordType } from "@/shared/api/auth/model";
import { useMobxStores } from "@/shared/store/RootStore";
import {Button, Form, Input, notification, Tabs, TabsProps} from "antd";
import {observer} from "mobx-react";

const SettingsPage = () => {
    const {authStore} = useMobxStores()
    const [form] = Form.useForm<ChnagePasswordType>();

    const handleChangePassword = (values:ChnagePasswordType) => {
        authStore.changePassword(values).then((response) => {
            notification.success({message: response.message})
            form.resetFields();
        }).catch(e => {
            notification.error({message: e.response.data.message})
        });
    };


    const items: TabsProps['items'] = [
        {
          key: "2",
          label: "Безопасность",
          children: (
            <div className="space-y-4 w-1/3">
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
                        { required: true, message: 'Введите текущий пароль' },
                    ]}
                    >
                    <Input.Password placeholder="Текущий пароль" />
                    </Form.Item>

                    <Form.Item
                    name="newPassword"
                    label="Новый пароль"
                    rules={[
                        { required: true, message: 'Введите новый пароль' },
                        { min: 8, message: 'Пароль должен содержать минимум 8 символов' },
                    ]}
                    >
                    <Input.Password placeholder="Новый пароль" />
                    </Form.Item>

                    <Form.Item
                    name="confirmNewPassword"
                    label="Подтвердите новый пароль"
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
                    <Input.Password placeholder="Подтвердите новый пароль" />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Сохранить новый пароль
                    </Button>
                    </Form.Item>
                </Form>
            </div>
          ),
        },
      ];

    return(
        <div className="container mx-auto">
            <h1 className="text-4xl my-5">Настройки</h1>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    )
}

export default observer(SettingsPage);