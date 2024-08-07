import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Button, Form, Input, notification} from "antd";
import React from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import Link from "next/link";
import {MAIN_COLOR} from "@/app/constans";

const LoginComponent = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();

    return <div className="flex">
        <div className="m-auto">
            <Form
                form={form}
                layout="vertical"
                style={{width: 300}}
                onFinish={() => userStore.loginUser(form.getFieldsValue()).then(() => {

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
                    <Input
                        placeholder="Введите Email"
                    />
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
                    <Link href="/forgot-password" style={{color: MAIN_COLOR}}>Восстановить пароль</Link>
                </div>

                <div className="flex flex-col items-center">
                    <Form.Item style={{marginTop: '22px'}}>
                        <Button type="primary" htmlType="submit" loading={userStore.loading}
                                style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                            Войти
                        </Button>
                    </Form.Item>
                    <p>Нет аккаунта? <Link href="/register" style={{color: MAIN_COLOR}}>Зарегистрируйся</Link></p>
                </div>

            </Form>
        </div>
    </div>
}

export default observer(LoginComponent)