"use client"
import { Form, Input, Button, Select, Switch, Upload, Avatar, DatePicker, Radio, Tooltip, Divider } from "antd";
import { UploadOutlined, UserOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {useMobxStores} from "@/stores/stores";

const ProfilePage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);

    const {userStore} = useMobxStores()

    const handleUploadChange = (info:any) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // setAvatar(URL.createObjectURL(info.file.originFileObj));
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-8 overflow-y-scroll" style={{height: 'calc(100vh - 60px)'}}>
            <div className="flex items-center mb-8">
                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleUploadChange}
                >
                    <Avatar
                        size={100}
                        src={avatar}
                        icon={!avatar && <UserOutlined />}
                        className="cursor-pointer transition-transform hover:scale-105"
                    />
                </Upload>
                <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-800">Профиль пользователя</h2>
                    <p className="text-gray-600">Здесь вы можете обновить ваши личные данные и настройки.</p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    console.log("Updated Profile:", values);
                }}
            >
                <Form.Item
                    label="Имя"
                    name="firstName"
                    rules={[{ required: true, message: "Пожалуйста, введите ваше имя" }]}
                >
                    <Input placeholder="Введите ваше имя" />
                </Form.Item>

                <Form.Item
                    label="Фамилия"
                    name="lastName"
                    rules={[{ required: true, message: "Пожалуйста, введите вашу фамилию" }]}
                >
                    <Input placeholder="Введите вашу фамилию" />
                </Form.Item>

                <Form.Item
                    label="Электронная почта"
                    name="email"
                    rules={[{ required: true, message: "Пожалуйста, введите вашу электронную почту" }]}
                >
                    <Input type="email" placeholder="Введите вашу электронную почту" />
                </Form.Item>

                <Form.Item label="Роль" name="role">
                    <Select>
                        <Select.Option value="Администратор">Администратор</Select.Option>
                        <Select.Option value="Редактор">Редактор</Select.Option>
                        <Select.Option value="Пользователь">Пользователь</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Уведомления"
                    name="notifications"
                    valuePropName="checked"
                    tooltip="Включите, чтобы получать уведомления о событиях в системе."
                >
                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                </Form.Item>

                <Form.Item
                    label="Дата рождения"
                    name="dob"
                >
                    <DatePicker placeholder="Выберите дату" className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Смена пароля"
                    tooltip={{ title: 'Минимум 8 символов', icon: <InfoCircleOutlined /> }}
                >
                    <Input.Password
                        placeholder="Введите новый пароль"
                        iconRender={(visible) => (visible ? <LockOutlined /> : <LockOutlined />)}
                    />
                </Form.Item>

                <Form.Item
                    label="Тема интерфейса"
                    name="theme"
                    tooltip="Выберите тему оформления сайта"
                >
                    <Radio.Group>
                        <Radio value="light">Светлая</Radio>
                        <Radio value="dark">Тёмная</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Подписка на новости"
                    name="newsletter"
                    valuePropName="checked"
                    tooltip="Подписаться на нашу рассылку новостей и обновлений"
                >
                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" className="dark:hover:bg-black" />
                </Form.Item>

                <Divider />

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="mt-4 dark:hover:bg-black">
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProfilePage;
