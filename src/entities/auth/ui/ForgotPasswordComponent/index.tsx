import { observer } from "mobx-react";
import React from "react";
import { Button, Form, Input } from "antd";
import { useMobxStores } from "@/stores/stores";
import { MAIN_COLOR } from "@/shared/constants";

export const ForgotPasswordComponent = observer(() => {
    const { userStore } = useMobxStores();
    const [form] = Form.useForm();

    return (
        <div className="flex">
            <div className="m-auto">
                <Form
                    form={form}
                    layout="vertical"
                    style={{ width: 300 }}
                    onFinish={userStore.sendEmailForgotPassword}
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

                    <div className="flex flex-col items-center">
                        <Form.Item style={{ marginTop: '22px' }}>
                            <Button type="primary" htmlType="submit"
                                    style={{ padding: '20px 43px', display: "flex", alignItems: "center" }}>
                                Отправить
                            </Button>
                        </Form.Item>

                        <span className="hover:cursor-pointer"
                              onClick={() => {
                                  userStore.setOpenForgotPasswordModal(false)
                                  form.resetFields();
                              }} style={{ color: MAIN_COLOR }}>Войти в аккаунт</span>
                    </div>

                </Form>
            </div>
        </div>
    );
})