import {Button, Form, Input} from "antd";
import React, {FC} from "react";
import { ChangePasswordType } from "@/shared/api/auth/model";

interface ChangePasswordProps {
    handleChangePassword: (values:ChangePasswordType) => void
}

export const ResetPassword: FC<ChangePasswordProps> = ({handleChangePassword}) => {
    const [form] = Form.useForm<ChangePasswordType>();
    return <Form
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
                { required: true, message: 'Введите новый пароль' }
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
}