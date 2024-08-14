"use client"
import React, {useState} from "react";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import {Form, Input, Button, notification} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from "next/link";
import {MAIN_COLOR} from "../constans"
import {useRouter} from "next/navigation";

type LayoutType = Parameters<typeof Form>[0]['layout'];
const LoginPage = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();
    const [formLayout] = useState<LayoutType>('vertical');
    const router = useRouter()

    return(
        <div className="flex h-screen">
           <div className="m-auto">
               {/*<div className="border-dashed border-2 border-black-500 text-center p-4 mb-8">Логотип</div>*/}

               <h2 className="text-center">Вход в систему</h2>
               <Form
                   form={form}
                   layout={formLayout}
                   style={{width:300}}
                   onFinish={() => userStore.loginUser(form.getFieldsValue()).then(() => {
                       router.push('/platform')
                   }).catch((e) => {
                       notification.error({
                           message: e.response.data.message
                       })
                   })}
               >
                   <Form.Item
                       label="Email"
                       name="email"
                       rules={[{required: true,message:"Поле обязательно!"}]}
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

                   <div className="flex justify-end">
                       <Link href={"/forgot-password"} style={{color:MAIN_COLOR}}>Восстановить пароль</Link>
                   </div>

                   <div className="flex flex-col items-center">
                       <Form.Item style={{marginTop: '22px'}}>
                           <Button type="primary" htmlType="submit" loading={userStore.loading}
                                   style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                               Войти
                           </Button>
                       </Form.Item>
                       <p>Нет аккаунта? <Link href={"/register"} style={{color:MAIN_COLOR}}>Зарегистрируйся</Link></p>
                   </div>

               </Form>
           </div>
        </div>
    );
}

export default observer(LoginPage);