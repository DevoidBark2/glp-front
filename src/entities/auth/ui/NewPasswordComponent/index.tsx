"use client"
import React, { useState } from "react";
import { Button, Form, Input, notification } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useMobxStores } from "@/shared/store/RootStore";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import nextConfig from "next.config.mjs";

const NewPasswordComponent = () => {
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const [form] = Form.useForm();
    const router = useRouter()
    const { authStore } = useMobxStores();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = (values: any) => {
        if(!recaptcha) {
            notification.error({message: "Пожалуйста, завершите reCAPTCHA"})
            return;
        }
        authStore.newPassword(values,token).then(response => {
            notification.success({message: "Пароль успешно обновлен"})
            router.push('login')
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    }

    return (
        <div className="flex mt-8">
        <div className="m-auto">
            <h1 className="text-3xl font-bold text-gray-900">Создайте новый пароль</h1>
            <p className="text-sm text-gray-600 mt-2 mb-4">
                Придумайте новый надежный пароль, чтобы защитить ваш аккаунт.
            </p>
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
            <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: "Поле обязательно!" }]}
            >
                <Input.Password
                    placeholder="Введите пароль"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Form.Item>

            <Form.Item
                label="Повторите пароль"
                name="password_repeat"
                dependencies={['password']}
                rules={[
                    { required: true, message: "Поле обязательно!" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли не совпадают!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    placeholder="Введите пароль"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
            </Form.Item>

            <div className="flex justify-center">
                <ReCAPTCHA
                    sitekey={nextConfig.env?.GOOGLE_RECAPTCHA_SITE_KEY ?? ''}
                    onChange={setRecaptcha}
                />
            </div>

            <div className="flex flex-col items-center">
                <Form.Item style={{ marginTop: '22px' }}>
                    <Button type="primary" htmlType="submit"
                            style={{ padding: '20px 43px', display: "flex", alignItems: "center" }}>
                        Продолжить
                    </Button>
                </Form.Item>
            </div>
            </Form>
        </div>
    </div>
    )
}

export default NewPasswordComponent