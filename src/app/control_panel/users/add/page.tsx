"use client";
import { observer } from "mobx-react";
import { Breadcrumb, Form, Input, Button, Select, Switch, Divider, Upload, Tooltip, Tag, Space, DatePicker } from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import React from "react";

const UserCreatePage = () => {
    const [form] = Form.useForm();

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            console.log('Image uploaded successfully:', info.file.response);
        }
    };

    const onFinish = (values) => {
        console.log('Полученные данные:', values);
        // Здесь можно добавить логику для сохранения пользователя
    };

    return (
        <div className="bg-white h-full p-5 overflow-y-auto overflow-x-hidden">
            <Breadcrumb
                items={[
                    {
                        title: <Link href="/control_panel/users">Пользователи</Link>,
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
                onFinish={onFinish}
            >
                <Form.Item
                    label="Имя"
                    name="first_name"
                    rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
                >
                    <Input placeholder="Введите имя" />
                </Form.Item>

                <Form.Item
                    label="Фамилия"
                    name="last_name"
                    rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
                >
                    <Input placeholder="Введите фамилию" />
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
                    rules={[{ required: true, message: 'Пожалуйста, введите телефонный номер!' }]}
                >
                    <Input placeholder="Введите телефонный номер" />
                </Form.Item>

                <Form.Item
                    label="Дата рождения"
                    name="birth_date"
                    rules={[{ required: true, message: 'Пожалуйста, выберите дату рождения!' }]}
                >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Адрес"
                    name="address"
                >
                    <Input.TextArea placeholder="Введите адрес" rows={3} />
                </Form.Item>

                <Form.Item
                    label="Роль пользователя"
                    name="role"
                    rules={[{ required: true, message: 'Пожалуйста, выберите роль!' }]}
                >
                    <Select placeholder="Выберите роль">
                        <Select.Option value="admin">Администратор</Select.Option>
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
                    name="is_active"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                    <Tooltip title="Активный пользователь может войти в систему и использовать все доступные функции.">
                        <InfoCircleOutlined className="ml-2 text-gray-500" />
                    </Tooltip>
                </Form.Item>

                <Form.Item
                    label="Двухфакторная аутентификация (2FA)"
                    name="2fa"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                    <Tooltip title="Включите двухфакторную аутентификацию для повышения безопасности.">
                        <InfoCircleOutlined className="ml-2 text-gray-500" />
                    </Tooltip>
                </Form.Item>

                <Form.Item
                    label="Настройки уведомлений"
                    name="notifications"
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Switch checkedChildren="Email" unCheckedChildren="No Email" /> Email уведомления
                        <Switch checkedChildren="SMS" unCheckedChildren="No SMS" /> SMS уведомления
                        <Switch checkedChildren="Push" unCheckedChildren="No Push" /> Push уведомления
                    </Space>
                </Form.Item>

                <Form.Item
                    label="Метки"
                    name="tags"
                >
                    <Select
                        mode="tags"
                        placeholder="Введите метки"
                        style={{ width: '100%' }}
                    >
                        {/* Опционально можно добавить предустановленные метки */}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Аватар пользователя"
                    name="avatar"
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="/upload" // URL для загрузки изображения
                        onChange={handleImageChange}
                    >
                        <div>
                            <UploadOutlined />
                            <div className="ant-upload-text">Загрузить изображение</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Дата последнего входа"
                    name="last_login"
                >
                    <Input disabled value="Неизвестно" />
                </Form.Item>

                <Divider />

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Создать пользователя
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default observer(UserCreatePage);
