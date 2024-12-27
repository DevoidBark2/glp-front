"use client"
import React, { useState } from "react";
import { Button, Form, Input, notification } from "antd";
import { MAIN_COLOR } from "@/shared/constants";
import { useRouter } from "next/navigation";
import { useMobxStores } from "@/shared/store/RootStore";
import ReCAPTCHA from "react-google-recaptcha";
import nextConfig from "next.config.mjs";
import { observer } from "mobx-react";

export const ForgotPasswordComponent = observer(() => {
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const router = useRouter()
    const { authStore } = useMobxStores();
    const [form] = Form.useForm();

    const onSubmit = (values: any) => {
        if(!recaptcha) {
            notification.error({message: "Пожалуйста, завершите reCAPTCHA"})
            return;
        }
        authStore.resetPassword(values).then(response => {
            notification.success({message: "На почут отправдлено письмо для сброса пароля!"})
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    }

    return (
        <div className="flex mt-8">
            <div className="m-auto">
                <h1 className="text-3xl font-bold text-gray-900">Сброс пароля</h1>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                    Введите вашу почту, и мы отправим вам письмо для сброса пароля.
                </p>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Поле обязательно!" },
                            { type: "email", message: "Не верный формат email!" }
                        ]}
                    >
                        <Input placeholder="Введите Email" />
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
                                Отправить
                            </Button>
                        </Form.Item>

                        <span className="hover:cursor-pointer"
                            onClick={() => {
                                router.push('login')
                                form.resetFields();
                            }} 
                            style={{ color: MAIN_COLOR }}>Войти в аккаунт</span>
                    </div>

                </Form>
            </div>
        </div>
    );
})