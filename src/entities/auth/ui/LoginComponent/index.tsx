import React, {useState} from "react";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import { notification, Button, Form, Input, Modal, Divider } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import nextConfig from "../../../../../next.config.mjs";
import ReCAPTCHA from "react-google-recaptcha"
import {useRouter} from "next/navigation";
import Image from "next/image"

export const LoginComponent = observer(() => {
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const router = useRouter()
    const { userStore } = useMobxStores();
    const [form] = Form.useForm();
    const [isShowTwoFactor, setIsShowTwoFacor] = useState(false)
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const onSubmit = (values: any) => {
        if (!recaptcha) {
            notification.error({message: "Пожалуйста, завершите reCAPTCHA"})
            return;
        }

        const body = isShowTwoFactor ? {
            ...credentials,
            code: values.code
        } : values
        userStore.loginUser(body).then((response) => {
            if(response.message) {
                notification.success({message: response.message})
                setIsShowTwoFacor(true);
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
        <div className="flex justify-center items-center mt-8">
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

                {isShowTwoFactor && (
                    <Form.Item
                        name="code"
                        label="Код"
                        rules={[{required:true, message:"Введите код!"}]}
                    >
                        <Input.OTP/>
                    </Form.Item>
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
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                />
                </Form.Item>
                    </>
                )}

                

                <div className="flex justify-center">
                    <ReCAPTCHA
                        sitekey={nextConfig.env?.GOOGLE_RECAPTCHA_SITE_KEY ?? ''}
                        onChange={setRecaptcha}
                    />
                </div>

                <div className="flex justify-end mb-4 mt-4">
                    <span
                        className="hover:cursor-pointer text-primary-color text-[#00b96b]"
                        onClick={() => router.push('reset-password')}
                    >
                        Восстановить пароль
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: "22px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={userStore.loading}
                            style={{ padding: "10px 43px" }}
                        >
                            Войти
                        </Button>
                    </Form.Item>
                    <p>
                        Нет аккаунта?
                        <span
                            className="hover:cursor-pointer ml-1 text-primary-color text-[#00b96b] transition-opacity duration-300 ease-in-out hover:opacity-70"
                            onClick={() => router.push('register')}
                        >
                            Зарегистрируйся
                        </span>
                    </p>
                </div>
            </Form>
        </div>
    );
});
