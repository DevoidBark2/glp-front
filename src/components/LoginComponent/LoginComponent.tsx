import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Button, Form, Input, notification} from "antd";
import React from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {MAIN_COLOR} from "@/constants";

const LoginComponent = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();

    return <div className="flex">
        <div className="m-auto">
            <Form
                form={form}
                layout="vertical"
                style={{width: 300}}
                onFinish={(values) => userStore.loginUser(values).then(() => {
                    form.resetFields();
                }).catch((e) => {
                    notification.error({
                        message: e.response.data.message
                    })
                })}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true, message: "Поле обязательно!"}]}
                >
                    <Input placeholder="Введите Email"/>
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{required: true, message: "Поле обязательно!"}]}
                >
                    <Input.Password
                        placeholder="Введите пароль"
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                    />
                </Form.Item>

                <div className="flex justify-end">
                    <span className="hover:cursor-pointer" onClick={() => {
                        userStore.setOpenForgotPasswordModal(true)
                    }} style={{color: MAIN_COLOR}}>Восстановить пароль</span>
                </div>

                <div className="flex flex-col items-center">
                    <Form.Item style={{marginTop: '22px'}}>
                        <Button type="primary" htmlType="submit" loading={userStore.loading}
                                style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                            Войти
                        </Button>
                    </Form.Item>
                    <p>Нет аккаунта? <span className="hover:cursor-pointer" onClick={() => {
                        userStore.setOpenRegisterModal(true)
                    }} style={{color: MAIN_COLOR}}>Зарегистрируйся</span></p>
                </div>

            </Form>
        </div>
    </div>
}

export default observer(LoginComponent)