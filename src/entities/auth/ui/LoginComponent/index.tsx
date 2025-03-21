"use client"
import React, { useState } from "react";
import { observer } from "mobx-react";
import { notification, Button, Form, Input, Divider } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha"
import { useRouter } from "next/navigation";
import Image from "next/image"

import { useMobxStores } from "@/shared/store/RootStore";

import nextConfig from "../../../../../next.config.mjs";

export const LoginComponent = observer(() => {
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const router = useRouter()
    const { userStore } = useMobxStores();
    const [form] = Form.useForm();
    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const onSubmit = (values: any) => {
        if (!recaptcha) {
            notification.error({ message: "Пожалуйста, завершите reCAPTCHA" })
            return;
        }

        const body = isShowTwoFactor ? {
            ...credentials,
            code: values.code
        } : values

        userStore.loginUser(body).then((response) => {
            if (response.message) {
                notification.success({ message: response.message })
                setIsShowTwoFactor(true);
                setCredentials({
                    email: values.email,
                    password: values.password,
                });
                return;
            }
            form.resetFields();
            router.push("/platform/profile")
        }).catch((e) => {
            notification.error({ message: e.response.data.message })
        })
    }

    const handleProvider = async (provider: 'google' | 'yandex') => {
        const response = await userStore.oauthByProvider(provider)

        router.push(response.url)
    }

    return (
        <div className="flex justify-center items-center mt-8 px-4">
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
                <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать!</h1>
                <p className="text-sm text-gray-600 mt-2">
                    Введите вашу почту и пароль, чтобы получить доступ к профилю.
                </p>
                <div className="flex items-center mt-6 gap-4">
                    <Button
                        type="default"
                        icon={
                            <Image
                                src="/static/google-icon.svg"
                                alt="Google"
                                width={16}
                                height={16}
                            />
                        }
                        className="w-full flex items-center justify-center text-white rounded-md"
                        onClick={() => handleProvider('google')}
                    >
                        Google
                    </Button>
                    <Button
                        type="default"
                        icon={
                            <Image
                                src="/static/yandex-icon.svg"
                                alt="Google"
                                width={16}
                                height={16}
                            />
                        }
                        className="w-full flex items-center justify-center bg-[#ffcc00] text-black rounded-md hover:bg-[#e6b800] transition-all"
                        onClick={() => handleProvider('yandex')}
                    >
                        Yandex
                    </Button>
                </div>

                <Divider className="uppercase"><p className="text-gray-500">Или</p></Divider>

                {isShowTwoFactor && (
                    <div className="flex justify-center">
                        <Form.Item
                            name="code"
                            label="Код"
                            rules={[{ required: true, message: "Введите код!" }]}
                        >
                            <Input.OTP />
                        </Form.Item>
                    </div>
                )}

                {!isShowTwoFactor && (
                    <>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Поле обязательно!" },
                                { type: "email", message: "Формат email должен быть верным!" },
                            ]}
                        >
                            <Input placeholder="Введите Email" />
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: "Поле обязательно!" }]}
                        >
                            <Input.Password
                                placeholder="Введите пароль"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone style={{ color: "grey" }} /> : <EyeInvisibleOutlined style={{ color: "grey" }} />
                                }
                            />
                        </Form.Item>
                    </>
                )}

                <div className="flex justify-end mb-4 mt-4">
                    <button
                        type="button"
                        className="hover:cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => router.push('reset-password')}
                    >
                        Восстановить пароль
                    </button>
                </div>

                <div className="flex justify-center mt-10">
                    <ReCAPTCHA
                        sitekey={nextConfig.env?.GOOGLE_RECAPTCHA_SITE_KEY ?? ''}
                        onChange={setRecaptcha}
                    />
                </div>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: "22px" }}>
                        <Button
                            htmlType="submit"
                            color="default" variant="solid"
                            loading={userStore.loading}
                            style={{ padding: "10px 43px" }}
                        >
                            Войти
                        </Button>
                    </Form.Item>
                    <p>
                        Нет аккаунта?
                        <button
                            type="button"
                            className="hover:cursor-pointer text-gray-500 hover:text-gray-800 ml-2"
                            onClick={() => router.push('register')}
                        >
                            Зарегистрируйся
                        </button>
                    </p>
                </div>
            </Form>
        </div>
    );
});
