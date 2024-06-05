"use client"
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Button, Form, Input,Radio,DatePicker,Select} from "antd";
import React, {useEffect, useState} from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import Link from "next/link";
import ru from "antd/es/date-picker/locale/ru_RU"
import {MAIN_COLOR} from "@/app/constans";

type LayoutType = Parameters<typeof Form>[0]['layout'];


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
    const [formLayout] = useState<LayoutType>('vertical');
    const [studentEnabledFields,setStudentEnabledFields] = useState<boolean>(true)

    return(
        <div className="flex h-screen">
            <div className="m-auto mt-20">
                <div className="border-dashed border-2 border-black-500 text-center p-4 mb-8">Логотип</div>

                <h2 className="text-center">Регистрация</h2>

                <Form
                    form={form}
                    layout={formLayout}
                    style={{width:300}}
                    onFinish={userStore.registerUser}
                    initialValues={{
                        ["role"]: "1"
                    }}
                >
                    <Form.Item
                        label="Выберите вашу роль"
                        name="role"
                    >
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="1" checked={true} onClick={() => setStudentEnabledFields(true)}>Ученик</Radio.Button>
                            <Radio.Button value="2" onClick={() => setStudentEnabledFields(false)}>Преподаватель</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {
                        studentEnabledFields && <Form.Item
                            label="Выберите желаемого преподавателя"
                            name="teacher"
                            rules={[{required: true,message:"Поле обязательно!"}]}
                        >
                           <Select>
                               <Select.Option value={1}>Якимова Ольга Павловна</Select.Option>
                               <Select.Option value={2}>Якимова Ольга Павловна</Select.Option>
                               <Select.Option value={3}>Якимова Ольга Павловна</Select.Option>
                           </Select>
                        </Form.Item>
                    }

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

                    <div className="flex flex-col items-center">
                        <Form.Item style={{marginTop: '22px'}}>
                            <Button type="primary" htmlType="submit"
                                    style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                        <p>Есть аккаунт? <Link href="/login" style={{color:MAIN_COLOR}}>Авторизуйся</Link></p>
                    </div>

                </Form>
            </div>
        </div>
    );
}

export default observer(RegisterPage)