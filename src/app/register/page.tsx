"use client"
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Button, Form, Input, DatePicker, notification} from "antd";
import React from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import Link from "next/link";
import ru from "antd/es/date-picker/locale/ru_RU"
import {MAIN_COLOR} from "@/app/constans";
import {OTPProps} from "antd/es/input/OTP";

const buddhistLocale = {
    ...ru,
    lang: {
        ...ru.lang,
        fieldDateFormat: 'YYYY-MM-DD',
        fieldDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        yearFormat: 'YYYY',
        timeFormat:'HH:mm:ss',
        cellYearFormat: 'YYYY',
    },
};


const RegisterPage = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();

    function onChange() {

    }

    const sharedProps: OTPProps = {
        onChange,
    };

    return(
        <div className="flex h-screen pt-15 pb-15">
            <div className="m-auto">

                {
                    !userStore.registerSuccess ?

                       <>
                           <h2 className="text-center">Регистрация</h2>

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
                                   label="Дата рождения"
                                   name="birth_day"
                                   rules={[{required: true,message:"Поле обязательно!"}]}
                               >
                                   <DatePicker
                                       style={{width:"100%"}}
                                       placeholder="Ваша дата рождения"
                                       showToday={false}
                                       locale={buddhistLocale}
                                       format={'YYYY-MM-DD'}
                                   />

                               </Form.Item>

                               <Form.Item
                                   label="Город"
                                   name="city"
                                   rules={[{required: true,message:"Поле обязательно!"}]}
                               >
                                   <Input
                                       placeholder="Введите город"
                                   />

                               </Form.Item>

                               <Form.Item
                                   label="Университет"
                                   name="university"
                                   rules={[{required: true,message:"Поле обязательно!"}]}
                               >
                                   <Input
                                       placeholder="Введите Ваш университет"
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

                               <div className="flex flex-col items-center">
                                   <Form.Item style={{marginTop: '22px'}}>
                                       <Button type="primary" htmlType="submit" loading={userStore.loading}
                                               style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                           Зарегистрироваться
                                       </Button>
                                   </Form.Item>
                                   <p>Есть аккаунт? <Link href={"/login"} style={{color:MAIN_COLOR}}>Авторизуйся</Link></p>
                               </div>
                           </Form>
                       </> : <>
                            <h1 className="text-center mb-2">Введите,пожалуйста, код из письма.</h1>
                            <Form>
                                <Form.Item
                                    name="otp_code"
                                >
                                    <Input.OTP length={8} {...sharedProps} size="large" />
                                </Form.Item>
                                <div className="flex flex-col items-center">
                                    <Form.Item style={{marginTop: '22px'}}>
                                        <Button type="primary" htmlType="submit"
                                                style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                            Подтвердить
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </>
                }


            </div>
        </div>
    );
}

export default observer(RegisterPage)