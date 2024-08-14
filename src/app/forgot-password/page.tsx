"use client"
import {observer} from "mobx-react";
import React, {useState} from "react";
import {Button, Form, Input} from "antd";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";
import {MAIN_COLOR} from "@/app/constans";

type LayoutType = Parameters<typeof Form>[0]['layout'];
const ForgotPasswordPage = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();
    const [formLayout] = useState<LayoutType>('vertical');

    return(
        <div className="flex h-screen">
            <div className="m-auto">
                <div className="border-dashed border-2 border-black-500 text-center p-4 mb-8">Логотип</div>

                <h2 className="text-center">Восстановление пароля</h2>
                <Form
                    form={form}
                    layout={formLayout}
                    style={{width:300}}
                    onFinish={userStore.sendEmailForgotPassword}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {required: true,message:"Поле обязательно!"},
                            {
                                type:"email",
                                message:"Не верный формат email!"
                            }
                        ]}
                    >
                        <Input
                            placeholder="Введите Email"
                        />
                    </Form.Item>

                    <div className="flex flex-col items-center">
                        <Form.Item style={{marginTop: '22px'}}>
                            <Button type="primary" htmlType="submit"
                                    style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                Войти
                            </Button>
                        </Form.Item>

                        <Link href={"/login"} style={{color:MAIN_COLOR}}>Войти в аккаунт</Link>
                    </div>

                </Form>
            </div>
        </div>
    );
}

export default observer(ForgotPasswordPage)