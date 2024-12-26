import { useMobxStores } from "@/stores/stores";
import { Button, Form, Input, notification } from "antd";
import React, {useState} from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {observer} from "mobx-react";
import { MAIN_COLOR } from "@/shared/constants";
import nextConfig from "../../../../../next.config.mjs";
import ReCAPTCHA from "react-google-recaptcha"

export const RegisterComponent = observer(() => {
    const [recaptcha, setRecaptcha] = useState<ReCAPTCHA | null>(null);
    const { userStore } = useMobxStores();
    const [form] = Form.useForm();

    const onSubmit = (values: any) => {
        if (!recaptcha) {
            notification.error({message: "Пожалуйста, завершите reCAPTCHA"})
            return;
        }
        userStore.registerUser(values).then(response => {
            userStore.setOpenRegisterModal(false);
            notification.success({ message: response.response.data.message })
        }).catch(e => notification.error({ message: e.response.data.message }))
    }

    return (
        <div className="flex">
            <div className="m-auto">
                <>
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ width: 300 }}
                        onFinish={onSubmit}
                    >
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

                        <ReCAPTCHA
                            sitekey={nextConfig.env?.GOOGLE_RECAPTCHA_SITE_KEY}
                            onChange={setRecaptcha}
                        />

                        <div className="flex flex-col items-center">
                            <Form.Item style={{ marginTop: '22px' }}>
                                <Button type="primary" htmlType="submit" loading={userStore.loading}
                                        style={{ padding: '20px 43px', display: "flex", alignItems: "center" }}>
                                    Зарегистрироваться
                                </Button>
                            </Form.Item>
                            <p>Есть аккаунт? <span onClick={() => {
                                userStore.setOpenRegisterModal(false)
                                form.resetFields();
                            }} className="hover:cursor-pointer" style={{ color: MAIN_COLOR }}>Авторизуйся</span></p>
                        </div>
                    </Form>
                </>
            </div>
        </div>
    );
})