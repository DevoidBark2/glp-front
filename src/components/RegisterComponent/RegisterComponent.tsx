"use client"
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Button, Form, Input, notification} from "antd";
import React from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {MAIN_COLOR} from "@/constants";


const RegisterComponent = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();
    return(
        <div className="flex">
            <div className="m-auto">
                {
                    !userStore.registerSuccess ?
                        <>
                            <Form
                                form={form}
                                layout="vertical"
                                style={{width:300}}
                                onFinish={() => userStore.registerUser(form.getFieldsValue()).catch(e => {
                                    notification.error({
                                        message: e.response.data.message
                                    })
                                })}
                            >
                                <Form.Item
                                    label="Фамилия"
                                    name="second_name"
                                    rules={[{required: true,message:"Поле обязательно!"}]}
                                >
                                    <Input
                                        placeholder="Введите вашу фамилию"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Имя"
                                    name="first_name"
                                    rules={[{required: true,message:"Поле обязательно!"}]}
                                >
                                    <Input
                                        placeholder="Введите ваше имя"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Отчество"
                                    name="last_name"
                                    rules={[{required: true,message:"Поле обязательно!"}]}
                                >
                                    <Input
                                        placeholder="Введите ваше отчество"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {required: true,message:"Поле обязательно!"},
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
                                    rules={[{required: true,message:"Поле обязательно!"}]}
                                >
                                    <Input.Password
                                        placeholder="Введите пароль"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Повторите пароль"
                                    name="password"
                                    rules={[{required: true,message:"Поле обязательно!"}]}
                                >
                                    <Input.Password
                                        placeholder="Введите пароль"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <div className="flex flex-col items-center">
                                    <Form.Item style={{marginTop: '22px'}}>
                                        <Button type="primary" htmlType="submit" loading={userStore.loading}
                                                style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                            Зарегистрироваться
                                        </Button>
                                    </Form.Item>
                                    <p>Есть аккаунт? <span onClick={() => {
                                        userStore.setOpenRegisterModal(false)
                                    }} className="hover:cursor-pointer" style={{color:MAIN_COLOR}}>Авторизуйся</span></p>
                                </div>
                            </Form>
                        </> : <>
                            <h1 className="text-center mb-2">Введите,пожалуйста, код из письма.</h1>
                        </>
                }
            </div>
        </div>
    );
}

export default observer(RegisterComponent)