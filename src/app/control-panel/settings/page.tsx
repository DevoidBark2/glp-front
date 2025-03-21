"use client"
import {Input, Form, Button, Switch, Tabs, Select, Spin, InputNumber} from "antd";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { InfoCircleOutlined } from "@ant-design/icons";

import { GeneralSettingTooltips } from "@/shared/constants";
import { useMobxStores } from "@/shared/store/RootStore";

const SettingsControlPage = () => {
    const { generalSettingsStore } = useMobxStores();
    const [formForGeneral] = Form.useForm();
    const [formForUserManagement] = Form.useForm();
    const [formForCourseManagement] = Form.useForm();
    const [formForSec] = Form.useForm();

    useEffect(() => {
        generalSettingsStore.getGeneralSettings().then((response) => {
            formForSec.setFieldsValue(response[0]);
            formForGeneral.setFieldsValue(response[0]);
            formForUserManagement.setFieldsValue(response[0]);
            formForCourseManagement.setFieldsValue(response[0]);
        }).finally(() => {
            generalSettingsStore.setLoading(false);
        });
    }, [formForCourseManagement, formForGeneral, formForSec, formForUserManagement, generalSettingsStore]);

    const tabItems = [
        {
            key: "1",
            label: "Общие настройки",
            children: (
                <Form
                    layout="vertical"
                    form={formForGeneral}
                    onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                >
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Название платформы" name="platform_name">
                        <Input placeholder="Введите название вашей платформы" />
                    </Form.Item>

                    <Form.Item label="Описание платформы" name="subscription_platform">
                        <Input.TextArea rows={3} placeholder="Введите описание, которое будет отображаться на сайте в нижнем колонтикуле" />
                    </Form.Item>

                    <Form.Item label="Email для поддержки" name="support_email">
                        <Input placeholder="Введите email для связи с поддержкой" />
                    </Form.Item>

                    <Form.Item
                        label="Контактный телефон"
                        name="contact_phone"
                        rules={[
                            {
                                pattern: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                                message: 'Введите номер в формате +7 (123) 456-78-90',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="service_mode"
                        valuePropName="checked"
                        label="Режим обслуживания"
                        tooltip="Включите, чтобы временно отключить сайт для технического обслуживания."
                    >
                        <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                    </Form.Item>

                    <Form.Item label="Сообщение для режима обслуживания" name="service_mode_text">
                        <Input.TextArea rows={3} placeholder="Введите сообщение, которое будет отображаться на сайте в режиме обслуживания" />
                    </Form.Item>

                    <Form.Item>
                        <Button variant="solid" color="blue" type="primary" htmlType="submit">Сохранить изменения</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: "2",
            label: "Управление пользователями",
            children: (
                <Form
                    layout="vertical"
                    form={formForUserManagement}
                    onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                >
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>

                    <Form.Item label="Роль пользователя по умолчанию" name="default_user_role">
                        <Select placeholder="Выберите роль по умолчанию">
                            <Select.Option value="student">Пользователь</Select.Option>
                            <Select.Option value="teacher">Создатель (учитель)</Select.Option>
                            <Select.Option value="moderator">Модератор</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Автоматическое подтверждение регистрации"
                        tooltip="Если включено, пользователи будут автоматически подтверждены после регистрации."
                        name="auto_confirm_register"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                    </Form.Item>

                    <Form.Item>
                        <Button variant="solid" color="blue" htmlType="submit">Сохранить изменения</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: "3",
            label: "Управление курсами",
            children: (
                <Form
                    layout="vertical"
                    form={formForCourseManagement}
                    onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                >
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={GeneralSettingTooltips.MAX_UPLOAD_FILE_SIZE.LABEL}
                        tooltip={GeneralSettingTooltips.MAX_UPLOAD_FILE_SIZE.TOOLTIP}
                        name="max_upload_file_size"
                    >
                        <Input
                            type="number"
                            placeholder={GeneralSettingTooltips.MAX_UPLOAD_FILE_SIZE.PLACEHOLDER}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button variant="solid" color="blue" htmlType="submit">Сохранить изменения</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: "5",
            label: "Настройки безопасности",
            children: (
                <Form
                    form={formForSec}
                    layout="vertical"
                    onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                >
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Максимальное количество попыток входа"
                        tooltip="Задайте количество попыток входа перед временной блокировкой пользователя."
                        name="max_login_attempts"
                    >
                        <InputNumber min={1} max={10} placeholder="Введите количество попыток" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Время блокировки после неудачных попыток (мин.)"
                        tooltip="Укажите время, на которое пользователь будет заблокирован после превышения лимита попыток входа."
                        name="lockout_duration"
                    >
                        <InputNumber min={1} max={60} placeholder="Введите время в минутах" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label={GeneralSettingTooltips.MIN_PASSWORD_LENGTH.LABEL}
                        tooltip={GeneralSettingTooltips.MIN_PASSWORD_LENGTH.TOOLTIP}
                        name="min_password_length"
                    >
                        <Input type="number" placeholder={GeneralSettingTooltips.MIN_PASSWORD_LENGTH.PLACEHOLDER} />
                    </Form.Item>

                    <Form.Item
                        label={GeneralSettingTooltips.COMPLEXITY_PASSWORD.LABEL}
                        tooltip={GeneralSettingTooltips.COMPLEXITY_PASSWORD.TOOLTIP}
                        name="password_complexity"
                    >
                        <Select placeholder={GeneralSettingTooltips.COMPLEXITY_PASSWORD.PLACEHOLDER}>
                            <Select.Option value="low">Низкая</Select.Option>
                            <Select.Option value="medium">Средняя</Select.Option>
                            <Select.Option value="high">Высокая</Select.Option>
                            <Select.Option value="very_high">Очень высокая</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button variant="solid" color="blue" htmlType="submit">Сохранить изменения</Button>
                    </Form.Item>
                </Form>
            )
        }
    ];

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen rounded">
            <div className="bg-gray-50 p-5 rounded-lg shadow-md mb-5">
                <div className="flex items-center">
                    <InfoCircleOutlined className="text-2xl text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Информация о настройках</h2>
                        <p className="text-gray-600 mt-1">
                            Здесь вы можете управлять основными параметрами вашего приложения.
                        </p>
                    </div>
                </div>
            </div>

            {generalSettingsStore.loading
                ? <div className="flex justify-center items-center"><Spin size="large" /></div>
                : <Tabs defaultActiveKey="1" items={tabItems} />
            }
        </div>
    );
};

export default observer(SettingsControlPage);