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
            setUploadedLogo(response.data[0].logo_url ? `${nextConfig.env?.API_URL}${response.data[0].logo_url}`: null)
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
                                onFinish={(values) => {
                                    const formData = new FormData();
                                    formData.append("platform_name", values.platform_name);
                                    formData.append("service_mode", values.service_mode);
                                    formData.append("cache_enabled", values.cache_enabled);
                                    formData.append("id", values.id)

                                    // Добавляем файл, если он есть
                                    if (file) {
                                        formData.append("logo_url", file);
                                    }
                                    debugger

                                    generalSettingsStore.saveGeneralSetting(formData);
                                }}
                            >
                                <Form.Item name="id" hidden></Form.Item>

                                <Form.Item label={GeneralSettingTooltips.PLATFORM_NAME.LABEL} name="platform_name">
                                    <Input placeholder={GeneralSettingTooltips.PLATFORM_NAME.PLACEHOLDER} />
                                </Form.Item>

                                {/* Поле для загрузки и отображения логотипа */}
                                <Form.Item label={GeneralSettingTooltips.PLATFORM_LOGO.LABEL} name="logo_url">
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

                                            setFile(file); // сохраняем файл в состоянии для отправки
                                            return false;
                                        }}
                                    >
                                        {uploadedLogo ? (
                                            <Image
                                                src={uploadedLogo}
                                                alt="Логотип"
                                                width={200}
                                                height={200}
                                            />
                                        ) : (
                                            <div>
                                                <UploadOutlined /> Загрузить логотип
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>

                                {/* Режим обслуживания */}
                                <Form.Item
                                    name="service_mode"
                                    valuePropName="checked"
                                    label={GeneralSettingTooltips.SERVICE_MODE.LABEL}
                                    tooltip={GeneralSettingTooltips.SERVICE_MODE.TOOLTIP}
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Настройки кэширования */}
                                <Form.Item label={GeneralSettingTooltips.CACHE_ENABLED.LABEL} name="cache_enabled">
                                    <Select placeholder={GeneralSettingTooltips.CACHE_ENABLED.PLACEHOLDER}>
                                        <Select.Option value={true}>Включено</Select.Option>
                                        <Select.Option value={false}>Отключено</Select.Option>
                                    </Select>
                                </Form.Item>

                                {/* Кнопка сохранения */}
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
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

                                {/* Существующие настройки */}
                                <Form.Item label={GeneralSettingTooltips.USER_ROLE_DEFAULT.LABEL} name="default_user_role">
                                    <Select placeholder={GeneralSettingTooltips.USER_ROLE_DEFAULT.PLACEHOLDER}>
                                        <Select.Option value="student">Пользователь</Select.Option>
                                        <Select.Option value="teacher">Создатель (учитель)</Select.Option>
                                        <Select.Option value="moderator">Модератор</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={GeneralSettingTooltips.AUTO_CONFIRM_REGISTER.LABEL}
                                    tooltip={GeneralSettingTooltips.AUTO_CONFIRM_REGISTER.TOOLTIP}
                                    name="auto_confirm_register"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                <Form.Item
                                    label={GeneralSettingTooltips.USER_COMPLAINT_NOTIFICATION.LABEL}
                                    tooltip={GeneralSettingTooltips.USER_COMPLAINT_NOTIFICATION.TOOLTIP}
                                    name="user_complaint_notification"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                <Form.Item label={GeneralSettingTooltips.PERIOD_USER_OF_INACTIVITY.LABEL} name="period_of_inactive">
                                    <Input
                                        type="number"
                                        placeholder={GeneralSettingTooltips.PERIOD_USER_OF_INACTIVITY.PLACEHOLDER}
                                    />
                                </Form.Item>

                                {/* Новые, более интересные настройки */}

                                {/* Настройки ограничений по возрасту */}
                                <Form.Item
                                    label="Ограничение доступа по возрасту"
                                    tooltip="Укажите минимальный возраст для доступа к различным функциям и материалам."
                                    name="age_restriction"
                                >
                                    <InputNumber min={1} max={100} placeholder="Введите минимальный возраст" style={{ width: '100%' }} />
                                </Form.Item>

                                {/* Настройки временной блокировки */}
                                <Form.Item
                                    label="Временная блокировка пользователей"
                                    tooltip="Позволяет временно заблокировать пользователей на определенный период."
                                    name="temp_user_block"
                                >
                                    <Select placeholder="Выберите период блокировки">
                                        <Select.Option value="1_day">1 день</Select.Option>
                                        <Select.Option value="7_days">1 неделя</Select.Option>
                                        <Select.Option value="30_days">1 месяц</Select.Option>
                                        <Select.Option value="permanent">Постоянная блокировка</Select.Option>
                                    </Select>
                                </Form.Item>

                                {/* Настройки пользовательского рейтинга */}
                                <Form.Item
                                    label="Система пользовательского рейтинга"
                                    tooltip="Включите рейтинговую систему, чтобы пользователи могли оценивать друг друга."
                                    name="user_rating_system"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Настройки массовой рассылки */}
                                <Form.Item
                                    label="Массовая рассылка уведомлений"
                                    tooltip="Отправляйте массовые уведомления пользователям о важных обновлениях или новостях."
                                    name="mass_notification"
                                >
                                    <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Выберите группы для рассылки">
                                        <Select.Option value="all">Всем пользователям</Select.Option>
                                        <Select.Option value="teachers">Только создателям (учителям)</Select.Option>
                                        <Select.Option value="moderators">Модераторам</Select.Option>
                                        <Select.Option value="inactive">Неактивным пользователям</Select.Option>
                                    </Select>
                                </Form.Item>

                                {/* Настройки разрешения смены имени пользователя */}
                                <Form.Item
                                    label="Разрешить смену имени пользователя"
                                    tooltip="Настройка, позволяющая пользователям менять свои имена."
                                    name="allow_username_change"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Настройки обязательного подтверждения профиля */}
                                <Form.Item
                                    label="Обязательное подтверждение профиля"
                                    tooltip="Требуйте подтверждение профиля через электронную почту или телефон."
                                    name="require_profile_verification"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>

                                {/* Настройки ограничений на количество создаваемых курсов */}
                                <Form.Item
                                    label="Лимит на количество создаваемых курсов"
                                    tooltip="Укажите максимальное количество курсов, которое может создать один пользователь."
                                    name="course_creation_limit"
                                >
                                    <InputNumber min={1} max={50} placeholder="Введите лимит" style={{ width: '100%' }} />
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
                                <Form.Item
                                    label={GeneralSettingTooltips.MODERATION_REVIEWS_COURSE.LABEL}
                                    tooltip={GeneralSettingTooltips.MODERATION_REVIEWS_COURSE.TOOLTIP}
                                    name="moderation_review_course"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>
                                {/*<Form.Item label="Выдача сертификатов по завершению курса">*/}
                                {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                                {/*</Form.Item>*/}
                                {/*<Form.Item label="Шаблон сертификата">*/}
                                {/*    <Input.TextArea rows={4} placeholder="Введите шаблон сертификата" />*/}
                                {/*</Form.Item>*/}
                                <Form.Item
                                    label={GeneralSettingTooltips.MODERATION_COURSE.LABEL}
                                    tooltip={GeneralSettingTooltips.MODERATION_COURSE.TOOLTIP}
                                    name="moderation_new_course"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>


                        {/* Financial Settings */}
                        {/*<TabPane tab="Финансовые настройки" key="4">*/}
                        {/*    <Form layout="vertical">*/}
                        {/*        <Form.Item label="Платежный шлюз по умолчанию">*/}
                        {/*            <Select defaultValue="stripe">*/}
                        {/*                <Select.Option value="stripe">Stripe</Select.Option>*/}
                        {/*                <Select.Option value="paypal">PayPal</Select.Option>*/}
                        {/*                <Select.Option value="bank">Банковский перевод</Select.Option>*/}
                        {/*                <Select.Option value="crypto">Криптовалюты</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Выберите платежный шлюз, который будет использоваться по умолчанию.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Минимальная сумма для вывода средств">*/}
                        {/*            <InputNumber min={10} max={10000} defaultValue={100} />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Установите минимальную сумму, необходимую для вывода средств.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Комиссия за транзакцию (%)">*/}
                        {/*            <InputNumber min={0} max={100} defaultValue={2.5} />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Установите процент комиссии за транзакции.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Периодичность выплат инструкторам">*/}
                        {/*            <Select defaultValue="monthly">*/}
                        {/*                <Select.Option value="weekly">Еженедельно</Select.Option>*/}
                        {/*                <Select.Option value="biweekly">Каждые две недели</Select.Option>*/}
                        {/*                <Select.Option value="monthly">Ежемесячно</Select.Option>*/}
                        {/*                <Select.Option value="quarterly">Ежеквартально</Select.Option>*/}
                        {/*                <Select.Option value="yearly">Ежегодно</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Выберите, как часто вы будете выплачивать гонорары инструкторам.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Настройка автоматических счетов">*/}
                        {/*            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Включите автоматическую генерацию счетов для транзакций и выплат.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Настройки налоговых ставок">*/}
                        {/*            <Form.Item label="Налоговая ставка (%)">*/}
                        {/*                <InputNumber min={0} max={100} defaultValue={20} />*/}
                        {/*                <div className="text-gray-500 mt-1">*/}
                        {/*                    Установите налоговую ставку, которая будет применяться к транзакциям.*/}
                        {/*                </div>*/}
                        {/*            </Form.Item>*/}
                        {/*            <Form.Item label="Налоговые категории">*/}
                        {/*                <Select mode="multiple" placeholder="Выберите категории налога">*/}
                        {/*                    <Select.Option value="vat">НДС</Select.Option>*/}
                        {/*                    <Select.Option value="sales">Налог с продаж</Select.Option>*/}
                        {/*                    <Select.Option value="income">Подоходный налог</Select.Option>*/}
                        {/*                </Select>*/}
                        {/*                <div className="text-gray-500 mt-1">*/}
                        {/*                    Выберите налоговые категории, которые будут применяться к транзакциям.*/}
                        {/*                </div>*/}
                        {/*            </Form.Item>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Настройки кэшбэка">*/}
                        {/*            <Form.Item label="Процент кэшбэка">*/}
                        {/*                <InputNumber min={0} max={100} defaultValue={5} />*/}
                        {/*                <div className="text-gray-500 mt-1">*/}
                        {/*                    Установите процент кэшбэка для покупателей, который будет начисляться на их аккаунт.*/}
                        {/*                </div>*/}
                        {/*            </Form.Item>*/}
                        {/*            <Form.Item label="Минимальная сумма для использования кэшбэка">*/}
                        {/*                <InputNumber min={0} max={10000} defaultValue={10} />*/}
                        {/*                <div className="text-gray-500 mt-1">*/}
                        {/*                    Установите минимальную сумму, которую необходимо потратить, чтобы использовать кэшбэк.*/}
                        {/*                </div>*/}
                        {/*            </Form.Item>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Интеграция с бухгалтерскими системами">*/}
                        {/*            <Select defaultValue="quickbooks">*/}
                        {/*                <Select.Option value="quickbooks">QuickBooks</Select.Option>*/}
                        {/*                <Select.Option value="xero">Xero</Select.Option>*/}
                        {/*                <Select.Option value="freshbooks">FreshBooks</Select.Option>*/}
                        {/*                <Select.Option value="wave">Wave</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Выберите бухгалтерскую систему для интеграции с вашей платформой.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item>*/}
                        {/*            <Button type="primary">Сохранить изменения</Button>*/}
                        {/*        </Form.Item>*/}
                        {/*    </Form>*/}
                        {/*</TabPane>*/}


                        {/* Security Settings */}
                        <TabPane tab="Настройки безопасности" key="5">
                            <Form
                                form={formForSec}
                                layout="vertical"
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >
                                <Form.Item name="id" hidden></Form.Item>

                                {/* Настройки безопасности */}
                                <Form.Item
                                    label={GeneralSettingTooltips.AUDIT_TRAIL.LABEL}
                                    tooltip={GeneralSettingTooltips.AUDIT_TRAIL.TOOLTIP}
                                    name="audit_enabled"
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
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
                                    <Button type="primary" htmlType="submit">Сохранить изменения</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>



                        {/* Communication Tools */}
                        {/*<TabPane tab="Инструменты связи" key="6">*/}
                        {/*    <Form layout="vertical">*/}
                        {/*        <Form.Item label="Шаблон email уведомлений">*/}
                        {/*            <Input.TextArea rows={4} placeholder="Введите шаблон email уведомлений" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Определите шаблоны для различных типов уведомлений, таких как подтверждение регистрации, сброс пароля и т.д.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Настройки SMS уведомлений">*/}
                        {/*            <Input placeholder="Введите API ключ для SMS сервиса" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Введите API ключ для интеграции с вашим SMS сервисом.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Поддержка в реальном времени">*/}
                        {/*            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Включите поддержку чата в реальном времени для общения с пользователями.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Настройки веб-пуш уведомлений">*/}
                        {/*            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Включите веб-пуш уведомления для обновлений и важных оповещений на платформе.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        /!*<Form.Item label="Интеграция с мессенджерами">*!/*/}
                        {/*        /!*    <Select mode="multiple" placeholder="Выберите мессенджеры для интеграции">*!/*/}
                        {/*        /!*        <Select.Option value="whatsapp">WhatsApp</Select.Option>*!/*/}
                        {/*        /!*        <Select.Option value="telegram">Telegram</Select.Option>*!/*/}
                        {/*        /!*        <Select.Option value="facebook">Facebook Messenger</Select.Option>*!/*/}
                        {/*        /!*        <Select.Option value="slack">Slack</Select.Option>*!/*/}
                        {/*        /!*    </Select>*!/*/}
                        {/*        /!*    <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*        Выберите мессенджеры, с которыми будет интегрирована ваша платформа.*!/*/}
                        {/*        /!*    </div>*!/*/}
                        {/*        /!*</Form.Item>*!/*/}
                        {/*        /!*<Form.Item label="Настройка автоматических ответов">*!/*/}
                        {/*        /!*    <Form.Item label="Время ответа (в часах)">*!/*/}
                        {/*        /!*        <InputNumber min={0} max={24} defaultValue={1} />*!/*/}
                        {/*        /!*        <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*            Установите время в часах для автоматического ответа на запросы пользователей.*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    </Form.Item>*!/*/}
                        {/*        /!*    <Form.Item label="Шаблон автоматического ответа">*!/*/}
                        {/*        /!*        <Input.TextArea rows={4} placeholder="Введите шаблон автоматического ответа" />*!/*/}
                        {/*        /!*        <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*            Определите текст автоматического ответа, который будет отправляться пользователям.*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    </Form.Item>*!/*/}
                        {/*        /!*</Form.Item>*!/*/}
                        {/*        /!*<Form.Item label="Статистика коммуникаций">*!/*/}
                        {/*        /!*    <Form.Item label="Период статистики">*!/*/}
                        {/*        /!*        <Select defaultValue="monthly">*!/*/}
                        {/*        /!*            <Select.Option value="daily">Ежедневно</Select.Option>*!/*/}
                        {/*        /!*            <Select.Option value="weekly">Еженедельно</Select.Option>*!/*/}
                        {/*        /!*            <Select.Option value="monthly">Ежемесячно</Select.Option>*!/*/}
                        {/*        /!*            <Select.Option value="quarterly">Ежеквартально</Select.Option>*!/*/}
                        {/*        /!*        </Select>*!/*/}
                        {/*        /!*        <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*            Выберите период, за который будет генерироваться статистика коммуникаций.*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    </Form.Item>*!/*/}
                        {/*        /!*    <Form.Item label="Включить графики и отчеты">*!/*/}
                        {/*        /!*        <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*!/*/}
                        {/*        /!*        <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*            Включите отображение графиков и отчетов по коммуникациям для анализа.*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    </Form.Item>*!/*/}
                        {/*        /!*</Form.Item>*!/*/}
                        {/*        <Form.Item>*/}
                        {/*            <Button type="primary">Сохранить изменения</Button>*/}
                        {/*        </Form.Item>*/}
                        {/*    </Form>*/}
                        {/*</TabPane>*/}


                        {/* Custom Branding */}
                        {/*<TabPane tab="Кастомизация и брендинг" key="7">*/}
                        {/*    <Form layout="vertical">*/}
                        {/*        <Form.Item label="Тема по умолчанию">*/}
                        {/*            <Select defaultValue="light">*/}
                        {/*                <Select.Option value="light">Светлая</Select.Option>*/}
                        {/*                <Select.Option value="dark">Тёмная</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Цветовая схема">*/}
                        {/*            <Input placeholder="Введите цветовой код (например, #1890ff)" />*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Фоновое изображение">*/}
                        {/*            <Input placeholder="Введите URL фонового изображения" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Загрузите фоновое изображение для страницы входа или основного экрана.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Шрифт по умолчанию">*/}
                        {/*            <Select defaultValue="arial">*/}
                        {/*                <Select.Option value="arial">Arial</Select.Option>*/}
                        {/*                <Select.Option value="times">Times New Roman</Select.Option>*/}
                        {/*                <Select.Option value="courier">Courier New</Select.Option>*/}
                        {/*                <Select.Option value="roboto">Roboto</Select.Option>*/}
                        {/*                <Select.Option value="open-sans">Open Sans</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Выберите шрифт по умолчанию для заголовков и текста на платформе.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Иконки и эмодзи">*/}
                        {/*            <Select mode="multiple" placeholder="Выберите иконки">*/}
                        {/*                <Select.Option value="home">Дом</Select.Option>*/}
                        {/*                <Select.Option value="settings">Настройки</Select.Option>*/}
                        {/*                <Select.Option value="user">Пользователь</Select.Option>*/}
                        {/*                <Select.Option value="notification">Уведомление</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Выберите иконки для различных функций и разделов платформы.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Анимации и переходы">*/}
                        {/*            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Включите анимации и переходы для улучшения пользовательского опыта.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Кастомизация кнопок">*/}
                        {/*            <Form.Item label="Форма кнопок">*/}
                        {/*                <Select defaultValue="rounded">*/}
                        {/*                    <Select.Option value="rounded">Закругленные углы</Select.Option>*/}
                        {/*                    <Select.Option value="square">Прямоугольные</Select.Option>*/}
                        {/*                </Select>*/}
                        {/*            </Form.Item>*/}
                        {/*            <Form.Item label="Цвет кнопок">*/}
                        {/*                <Input placeholder="Введите цветовой код (например, #ff5733)" />*/}
                        {/*            </Form.Item>*/}
                        {/*            <Form.Item label="Иконки на кнопках">*/}
                        {/*                <Select mode="multiple" placeholder="Выберите иконки для кнопок">*/}
                        {/*                    <Select.Option value="save">Сохранить</Select.Option>*/}
                        {/*                    <Select.Option value="edit">Редактировать</Select.Option>*/}
                        {/*                    <Select.Option value="delete">Удалить</Select.Option>*/}
                        {/*                </Select>*/}
                        {/*            </Form.Item>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Предпросмотр изменений">*/}
                        {/*            <Button type="default">Посмотреть изменения</Button>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Нажмите, чтобы просмотреть изменения в реальном времени.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item>*/}
                        {/*            <Button type="primary">Сохранить изменения</Button>*/}
                        {/*        </Form.Item>*/}
                        {/*    </Form>*/}
                        {/*</TabPane>*/}


                        {/* Advanced Reporting */}
                        {/*<TabPane tab="Расширенная аналитика" key="8">*/}
                        {/*    <Form layout="vertical">*/}
                        {/*        <Form.Item label="Настройка отчетов">*/}
                        {/*            <Select mode="multiple" placeholder="Выберите типы отчетов">*/}
                        {/*                <Select.Option value="user_activity">Активность пользователей</Select.Option>*/}
                        {/*                /!*<Select.Option value="financial">Финансовые отчеты</Select.Option>*!/*/}
                        {/*                <Select.Option value="course_performance">Эффективность курсов</Select.Option>*/}
                        {/*                <Select.Option value="engagement">Уровень вовлеченности</Select.Option>*/}
                        {/*                <Select.Option value="content_quality">Качество контента</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Выберите типы отчетов, которые вы хотите настраивать и просматривать.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item label="Частота отчетов">*/}
                        {/*            <Select defaultValue="monthly">*/}
                        {/*                <Select.Option value="daily">Ежедневно</Select.Option>*/}
                        {/*                <Select.Option value="weekly">Еженедельно</Select.Option>*/}
                        {/*                <Select.Option value="monthly">Ежемесячно</Select.Option>*/}
                        {/*                <Select.Option value="quarterly">Ежеквартально</Select.Option>*/}
                        {/*                <Select.Option value="yearly">Ежегодно</Select.Option>*/}
                        {/*            </Select>*/}
                        {/*            <div className="text-gray-500 mt-1">*/}
                        {/*                Установите частоту, с которой будут генерироваться отчеты.*/}
                        {/*            </div>*/}
                        {/*        </Form.Item>*/}
                        {/*        /!*<Form.Item label="Включить тепловые карты">*!/*/}
                        {/*        /!*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*!/*/}
                        {/*        /!*    <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*        Включение тепловых карт для визуализации активности пользователей на сайте.*!/*/}
                        {/*        /!*    </div>*!/*/}
                        {/*        /!*</Form.Item>*!/*/}
                        {/*        /!*<Form.Item label="Настройка пороговых значений для уведомлений">*!/*/}
                        {/*        /!*    <Form.Item label="Минимальный порог активности пользователей">*!/*/}
                        {/*        /!*        <InputNumber min={0} defaultValue={100} />*!/*/}
                        {/*        /!*        <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*            Установите минимальный порог для активности пользователей, при котором будут отправляться уведомления.*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    </Form.Item>*!/*/}
                        {/*        /!*    <Form.Item label="Минимальный порог для финансовых показателей">*!/*/}
                        {/*        /!*        <InputNumber min={0} defaultValue={5000} />*!/*/}
                        {/*        /!*        <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*            Установите порог для финансовых показателей, при котором будут отправляться уведомления.*!/*/}
                        {/*        /!*        </div>*!/*/}
                        {/*        /!*    </Form.Item>*!/*/}
                        {/*        /!*</Form.Item>*!/*/}
                        {/*        /!*<Form.Item label="Включить прогнозные аналитические отчеты">*!/*/}
                        {/*        /!*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*!/*/}
                        {/*        /!*    <div className="text-gray-500 mt-1">*!/*/}
                        {/*        /!*        Позволяет включить прогнозные отчеты для анализа будущих тенденций на основе исторических данных.*!/*/}
                        {/*        /!*    </div>*!/*/}
                        {/*        /!* </Form.Item> *!/*/}
                        {/*        <Form.Item label="Параметры фильтрации данных">*/}
                        {/*            <Form.Item label="Фильтр по дате">*/}
                        {/*                <DatePicker.RangePicker />*/}
                        {/*                <div className="text-gray-500 mt-1">*/}
                        {/*                    Установите диапазон дат для фильтрации данных в отчетах.*/}
                        {/*                </div>*/}
                        {/*            </Form.Item>*/}
                        {/*            /!*<Form.Item label="Фильтр по пользователям">*!/*/}
                        {/*            /!*    <Select mode="multiple" placeholder="Выберите пользователей">*!/*/}
                        {/*            /!*        <Select.Option value="user1">Пользователь 1</Select.Option>*!/*/}
                        {/*            /!*        <Select.Option value="user2">Пользователь 2</Select.Option>*!/*/}
                        {/*            /!*        <Select.Option value="user3">Пользователь 3</Select.Option>*!/*/}
                        {/*            /!*    </Select>*!/*/}
                        {/*            /!*    <div className="text-gray-500 mt-1">*!/*/}
                        {/*            /!*        Выберите пользователей для фильтрации данных в отчетах.*!/*/}
                        {/*            /!*    </div>*!/*/}
                        {/*            /!*</Form.Item>*!/*/}
                        {/*        </Form.Item>*/}
                        {/*        <Form.Item>*/}
                        {/*            <Button type="primary">Сохранить изменения</Button>*/}
                        {/*        </Form.Item>*/}
                        {/*    </Form>*/}
                        {/*</TabPane>*/}

                        <TabPane tab="Управление модераторами" key="6">
                            <Form
                                layout="vertical"
                                form={formForUserManagement}
                                onFinish={(values) => generalSettingsStore.saveGeneralSetting(values)}
                            >
                                {/* Права доступа модераторов */}
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

                                {/* Новые настройки */}

                                {/* Мониторинг активности модераторов */}
                                <Form.Item
                                    name="activityMonitoring"
                                    label="Мониторинг активности модераторов"
                                    tooltip="Настройте параметры для отслеживания активности модераторов."
                                >
                                    <Checkbox.Group
                                        options={[
                                            { label: 'Отслеживать количество проверенных постов', value: 'track_reviewed_posts' },
                                            { label: 'Отслеживать отклоненные/одобренные курсы', value: 'track_courses' },
                                            { label: 'Отслеживать время, потраченное на модерацию', value: 'track_time' },
                                            { label: 'Отслеживать количество предупреждений', value: 'track_warnings' },
                                        ]}
                                    />
                                    <div className="text-gray-500 mt-1">
                                        Включите нужные опции, чтобы получать статистику об активности модераторов.
                                    </div>
                                </Form.Item>

                                {/* Автоматическое распределение задач */}
                                <Form.Item
                                    name="autoAssignment"
                                    label="Автоматическое распределение задач"
                                    tooltip="Настройте автоматическое распределение задач между модераторами."
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                    <div className="text-gray-500 mt-1">
                                        При включении этой опции, система автоматически назначит посты и курсы для проверки модераторам в зависимости от их текущей нагрузки.
                                    </div>
                                </Form.Item>

                                {/* Система мотивации модераторов */}
                                <Form.Item
                                    name="moderatorMotivation"
                                    label="Система мотивации модераторов"
                                    tooltip="Настройте систему мотивации для повышения активности модераторов."
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Выберите типы наград"
                                        options={[
                                            { label: 'Бейджи за активность', value: 'badges' },
                                            { label: 'Премии за выполнение задач', value: 'bonuses' },
                                            { label: 'Публикация в рейтинге модераторов', value: 'leaderboard' },
                                            { label: 'Ежемесячный отчет о лучших модераторах', value: 'monthly_reports' },
                                        ]}
                                    />
                                    <div className="text-gray-500 mt-1">
                                        Выберите, каким образом вы хотите мотивировать модераторов для более активной работы.
                                    </div>
                                </Form.Item>

                                {/* Установить индивидуальные лимиты для модераторов */}
                                <Form.Item
                                    name="individualLimits"
                                    label="Установить индивидуальные лимиты"
                                    tooltip="Настройте индивидуальные лимиты на количество постов/курсов, которые каждый модератор может проверить за день."
                                >
                                    <InputNumber min={1} max={100} placeholder="Лимит на проверку" style={{ width: '100%' }} />
                                    <div className="text-gray-500 mt-1">
                                        Установите максимальное количество проверок в день для каждого модератора.
                                    </div>
                                </Form.Item>

                                {/* Автоматические напоминания модераторам */}
                                <Form.Item
                                    name="autoReminders"
                                    label="Автоматические напоминания"
                                    tooltip="Настройте автоматические напоминания модераторам о новых задачах или дедлайнах."
                                >
                                    <Radio.Group>
                                        <Radio value="none">Отключено</Radio>
                                        <Radio value="daily">Ежедневные напоминания</Radio>
                                        <Radio value="weekly">Еженедельные напоминания</Radio>
                                        <Radio value="deadline">Напоминания о приближении дедлайна</Radio>
                                    </Radio.Group>
                                    <div className="text-gray-500 mt-1">
                                        Напоминания будут отправляться на указанный email или в чат модератора.
                                    </div>
                                </Form.Item>

                                {/* Автоматическая блокировка при неактивности */}
                                <Form.Item
                                    name="autoBlockInactivity"
                                    label="Автоматическая блокировка при неактивности"
                                    tooltip="Настройте автоматическую блокировку модераторов при длительной неактивности."
                                >
                                    <InputNumber min={1} max={30} placeholder="Дни неактивности" style={{ width: '100%' }} />
                                    <div className="text-gray-500 mt-1">
                                        Укажите количество дней неактивности, после которых модератор будет временно заблокирован.
                                    </div>
                                </Form.Item>

                                {/* Разрешение на доступ к аналитике */}
                                <Form.Item
                                    name="analyticsAccess"
                                    label="Доступ к аналитике"
                                    tooltip="Позволяет модераторам просматривать аналитику своих действий."
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                    <div className="text-gray-500 mt-1">
                                        Включите, если хотите предоставить модераторам доступ к отчетам и аналитике их деятельности.
                                    </div>
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
