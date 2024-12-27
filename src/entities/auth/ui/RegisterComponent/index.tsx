import { useMobxStores } from "@/stores/stores";
import { Button, Divider, Form, Input, notification } from "antd";
import React, {useState} from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {observer} from "mobx-react";
import { MAIN_COLOR } from "@/shared/constants";
import nextConfig from "../../../../../next.config.mjs";
import ReCAPTCHA from "react-google-recaptcha"
import Image from "next/image"
import { useRouter } from "next/navigation";

export const RegisterComponent = observer(() => {
    const router = useRouter()
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const { userStore } = useMobxStores();
    const [form] = Form.useForm();

    const handleProvider = async (provider: 'google' | 'yandex') => {
        const response = await userStore.oauthByProvider(provider)
        router.push(response.url)
    }

    const onSubmit = (values: any) => {
        if (!recaptcha) {
            notification.error({message: "Пожалуйста, завершите reCAPTCHA"})
            return;
        }
        userStore.registerUser(values).then(response => {
            userStore.setOpenRegisterModal(false);
            notification.success({ message: response.message })
        }).catch(e => notification.error({ message: e.response.data.message }))
    }

    return (
        <div className="flex mt-8">
        <div className="m-auto">
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
                    className="w-full flex items-center justify-center bg-[#db4437] text-white rounded-md hover:bg-[#c23322] transition-all"
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

            <Form.Item
                label="Имя"
                name="first_name"
                rules={[{ required: true, message: "Поле обязательно!" }]}
            >
                <Input
                    placeholder="Введите ваше имя"
                />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Поле обязательно!" },
                    {
                        type: "email",
                        message: "Формат email должен быть верным!"
                    }
                ]}
            >
                <Input
                    placeholder="Введите Email"
                />
            </Form.Item>

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
                    <Button type="primary" htmlType="submit" loading={userStore.loading}
                            style={{ padding: '20px 43px', display: "flex", alignItems: "center" }}>
                        Зарегистрироваться
                    </Button>
                </Form.Item>
                <p>Есть аккаунт? <span onClick={() => {
                    router.push('login')
                    form.resetFields();
                }} className="hover:cursor-pointer" style={{ color: MAIN_COLOR }}>Авторизуйся</span></p>
            </div>
        </Form>
        </div>
    </div>
    );
})