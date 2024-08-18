"use client";
import React from "react";
import { observer } from "mobx-react";
import {
    Breadcrumb,
    Form,
    Input,
    Button,
    Select,
    Switch,
    Divider,
    DatePicker,
    notification
} from "antd";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {useMobxStores} from "@/stores/stores";
import {useRouter} from "next/navigation";

const UserCreatePage = () => {
    const {userStore} = useMobxStores()
    const [form] = Form.useForm();
    const router = useRouter();

    return (
        <div className="bg-white p-5 overflow-y-auto overflow-y-scroll" style={{height: 'calc(100vh - 60px)'}}>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control_panel/users"}>Пользователи</Link>,
                    },
                    {
                        title: 'Новый пользователь',
                    },
                ]}
            />
            <h1 className="text-center text-3xl mb-5">Добавление пользователя</h1>
            <Form
                form={form}
                layout="vertical"
                scrollToFirstError
                onFinish={(values) => userStore.createUser(values).then(response => {
                    router.push('/control_panel/users')
                    notification.success({message: response.response.message})
                }).catch((e) => {
                    notification.error({message: e.response.data.result})
                })}
            >
                <Form.Item
                    label="Фамилия"
                    name="second_name"
                    rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
                >
                    <Input placeholder="Введите фамилию" />
                </Form.Item>

                <Form.Item
                    label="Имя"
                    name="first_name"
                    rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
                >
                    <Input placeholder="Введите имя" />
                </Form.Item>

                <Form.Item
                    label="Отчество"
                    name="last_name"
                    rules={[{ required: true, message: 'Пожалуйста, введите отчество!' }]}
                >
                    <Input placeholder="Введите отчество" />
                </Form.Item>

                <Form.Item
                    label="Дата рождения"
                    name="birth_day"
                    rules={[{ required: true, message: 'Пожалуйста, выберите дату рождения!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Электронная почта"
                    name="email"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите электронную почту!' },
                        { type: 'email', message: 'Некорректный формат электронной почты!' },
                    ]}
                >
                    <Input placeholder="Введите email" />
                </Form.Item>

                <Form.Item
                    label="Телефонный номер"
                    name="phone"
                >
                    <PhoneInput
                        inputStyle={{width:'100%', height:'25px'}}
                        country={"ru"}
                        enableSearch={true}
                        searchPlaceholder={"Пожалуйста, введите телефонный номер!"}
                    />

                </Form.Item>

                <Form.Item
                    label="Город"
                    name="city"
                >
                    <Input placeholder="Введите город" />
                </Form.Item>

                <Form.Item
                    label="Университет"
                    name="university"
                >
                    <Input placeholder="Введите университет" />
                </Form.Item>

                <Form.Item
                    label="Роль пользователя"
                    name="role"
                    rules={[{ required: true, message: 'Пожалуйста, выберите роль!' }]}
                >
                    <Select placeholder="Выберите роль">
                        <Select.Option value="teacher">Преподаватель</Select.Option>
                        <Select.Option value="user">Пользователь</Select.Option>
                        <Select.Option value="manager">Менеджер</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
                >
                    <Input.Password placeholder="Введите пароль" />
                </Form.Item>

                <Form.Item
                    label="Подтверждение пароля"
                    name="confirm_password"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Пожалуйста, подтвердите пароль!' },
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
                    <Input.Password placeholder="Введите пароль еще раз" />
                </Form.Item>

                <Form.Item
                    label="Активен"
                    tooltip={"Активный пользователь может войти в систему и использовать все доступные функции."}
                    name="is_active"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="Двухфакторная аутентификация (2FA)"
                    name="2fa"
                    tooltip={"Включите двухфакторную аутентификацию для повышения безопасности."}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Divider />

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={userStore.createUserLoading}>
                        Создать пользователя
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default observer(UserCreatePage);
