"use client"
import { Divider, Input, Form, Button, Switch, Tabs, Select, Spin, Tooltip, Checkbox, Radio, Slider, InputNumber, TimePicker } from "antd";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import { GeneralSettingTooltips } from "@/constants";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image from "next/image"
import nextConfig from "next.config.mjs";
import InputMask from 'react-input-mask';

const SettingsControlPage = () => {
    const { TabPane } = Tabs;
    const { generalSettingsStore } = useMobxStores()
    const [formForGeneral] = Form.useForm()
    const [formForUserManagement] = Form.useForm()
    const [formForCourseManagement] = Form.useForm()
    const [formForSec] = Form.useForm()
    const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        generalSettingsStore.getGeneralSettings().then((response) => {
            formForSec.setFieldsValue(response.data[0])
            formForGeneral.setFieldsValue(response.data[0])
            setUploadedLogo(response.data[0].logo_url ? `${nextConfig.env?.API_URL}${response.data[0].logo_url}` : null)
            formForUserManagement.setFieldsValue(response.data[0])
            formForCourseManagement.setFieldsValue(response.data[0])
        }).finally(() => {
            generalSettingsStore.setLoading(false)
        });
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen rounded">
            <div className="bg-gray-50 p-5 rounded-lg shadow-md mb-5">
                <div className="flex items-center">
                    <InfoCircleOutlined className="text-2xl text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Информация о настройках</h2>
                        <p className="text-gray-600 mt-1">
                            Здесь вы можете управлять основными параметрами вашего приложения, включая безопасность,
                            настройки доступа и другие важные параметры. Обратите внимание на значок <Tooltip
                                title="Информация"><InfoCircleOutlined /></Tooltip>, чтобы получить подробную информацию о
                            каждом параметре.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-800 font-bold text-3xl mb-2">Настройки</h1>
                </div>
                <Divider />

                {generalSettingsStore.loading
                    ? <div className="flex justify-center items-center"><Spin size="large" /></div>
                    : <Tabs defaultActiveKey="1">
                        <TabPane tab="Общие настройки" key="1">
                            <Form
                                layout="vertical"
                                form={formForGeneral}
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >

                                <Form.Item name="id" hidden></Form.Item>
                                <Form.Item label="Название платформы" name="platform_name">
                                    <Input placeholder="Введите название вашей платформы" />
                                </Form.Item>

                                {/* <Form.Item label="Логотип платформы" name="logo_url">
                                    <Upload
                                        name="logo_url"
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            const isImage = file.type.startsWith("image/");
                                            if (!isImage) {
                                                message.error("Можно загрузить только изображения.");
                                                return Upload.LIST_IGNORE;
                                            }
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                const imageUrl = reader.result as string;
                                                setUploadedLogo(imageUrl);
                                            };
                                            reader.readAsDataURL(file);

                                            formForGeneral.setFieldValue("logo_url", file)
                                            setFile(file);
                                            return false;
                                        }}
                                    >
                                        {uploadedLogo ? (
                                            <Image src={uploadedLogo} alt="Логотип" width={200} height={200} />
                                        ) : (
                                            <div>
                                                <UploadOutlined /> Загрузить логотип
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item> */}

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
                                    <Input/>
                                    {/*<InputMask mask="+7 (999) 999-99-99" maskChar=" ">*/}
                                    {/*    {(inputProps) => <Input {...inputProps} placeholder="+7 (___) ___-__-__" />}*/}
                                    {/*</InputMask>*/}
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
                                    <Button type="primary" htmlType="submit">
                                        Сохранить изменения
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Управление пользователями" key="2">
                            <Form
                                layout="vertical"
                                form={formForUserManagement}
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >
                                <Form.Item name="id" hidden></Form.Item>

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
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Управление курсами" key="3">
                            <Form
                                layout="vertical"
                                form={formForCourseManagement}
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >
                                <Form.Item name="id" hidden></Form.Item>

                                <Form.Item
                                    label={GeneralSettingTooltips.AUTO_PUBLISH_COURSE.LABEL}
                                    tooltip={GeneralSettingTooltips.AUTO_PUBLISH_COURSE.TOOLTIP}
                                    name="auto_publish_course"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* <Form.Item
                                    label="Лимит на количество создаваемых курсов"
                                    tooltip="Укажите максимальное количество курсов, которое может создать один пользователь."
                                    name="course_creation_limit"
                                >
                                    <InputNumber min={1} max={50} placeholder="Введите лимит" style={{ width: '100%' }} />
                                </Form.Item> */}

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

                                {/* <Form.Item
                                    label={GeneralSettingTooltips.MODERATION_REVIEWS_COURSE.LABEL}
                                    tooltip={GeneralSettingTooltips.MODERATION_REVIEWS_COURSE.TOOLTIP}
                                    name="moderation_review_course"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item> */}

                                {/* Модерация новых курсов */}
                                <Form.Item
                                    label={GeneralSettingTooltips.MODERATION_COURSE.LABEL}
                                    tooltip={GeneralSettingTooltips.MODERATION_COURSE.TOOLTIP}
                                    name="moderation_new_course"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Настройка рейтинговой системы курсов */}
                                <Form.Item
                                    label="Рейтинговая система курсов"
                                    tooltip="Включите возможность оценки курсов пользователями."
                                    name="course_rating_system"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Включить возможность добавления дополнительных материалов */}
                                <Form.Item
                                    label="Дополнительные материалы к курсам"
                                    tooltip="Разрешить создателям курсов загружать дополнительные материалы, такие как PDF-файлы или презентации."
                                    name="allow_extra_materials"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Разрешить комментарии к курсам */}
                                {/* <Form.Item
                                    label="Комментарии к курсам"
                                    tooltip="Разрешить пользователям оставлять комментарии под курсами."
                                    name="allow_course_comments"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item> */}

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Настройки безопасности" key="5">
                            <Form
                                form={formForSec}
                                layout="vertical"
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >
                                <Form.Item name="id" hidden></Form.Item>
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

                                {/* Аудит действий */}
                                <Form.Item
                                    label={GeneralSettingTooltips.AUDIT_TRAIL.LABEL}
                                    tooltip={GeneralSettingTooltips.AUDIT_TRAIL.TOOLTIP}
                                    name="audit_enabled"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Минимальная длина пароля */}
                                <Form.Item
                                    label={GeneralSettingTooltips.MIN_PASSWORD_LENGTH.LABEL}
                                    tooltip={GeneralSettingTooltips.MIN_PASSWORD_LENGTH.TOOLTIP}
                                    name="min_password_length"
                                >
                                    <Input type="number" placeholder={GeneralSettingTooltips.MIN_PASSWORD_LENGTH.PLACEHOLDER} />
                                </Form.Item>

                                {/* Сложность пароля */}
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
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="Управление модераторами" key="6">
                            <Form
                                layout="vertical"
                                form={formForUserManagement}
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >
                                <Form.Item name="id" hidden></Form.Item>
                                <Form.Item
                                    name="moderationAccess"
                                    label="Права доступа модераторов"
                                    tooltip="Настройте права доступа модераторов к разным типам контента."
                                >
                                    <Checkbox.Group
                                        options={[
                                            { label: 'Модерация постов', value: 'moderate_posts' },
                                            { label: 'Модерация курсов', value: 'moderate_courses' },
                                            { label: 'Редактирование комментариев', value: 'edit_comments' },
                                            { label: 'Блокировка пользователей', value: 'block_users' },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                    </Tabs>
                }
            </div>
        </div>
    )
}

export default observer(SettingsControlPage);
