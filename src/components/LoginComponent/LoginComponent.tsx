import React from "react";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import { notification, Button, Form, Input, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const LoginComponent = () => {
    const { userStore } = useMobxStores();
    const [form] = Form.useForm();

    return (
        <div className="flex justify-center items-center h-full">
            <Modal
                open={userStore.openLoginModal}
                title="Авторизация"
                onCancel={() => userStore.setOpenLoginModal(false)}
                footer={null}
            >
                <div className="flex justify-center items-center">
                    <Form
                        form={form}
                        layout="vertical"
                        className="w-[350px]"
                        onFinish={(values) =>
                            userStore
                                .loginUser(values)
                                .then(() => {
                                    form.resetFields();
                                })
                                .catch((e) => notification.error({ message: e.response.data.message }))
                        }
                    >
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

                        <div className="flex justify-end mb-4">
                            <span
                                className="hover:cursor-pointer text-primary-color text-[#00b96b]"
                                onClick={() => userStore.setOpenForgotPasswordModal(true)}
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
                                    onClick={() => userStore.setOpenRegisterModal(true)}
                                >
                                    Зарегистрируйся
                                </span>
                            </p>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default observer(LoginComponent);
