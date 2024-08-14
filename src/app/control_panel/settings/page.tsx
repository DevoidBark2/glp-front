"use client"
import {Divider, Segmented, Input, Form, Button, Switch, Tabs, Select, InputNumber, DatePicker, Tooltip} from "antd";
import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {InfoCircleOutlined} from "@ant-design/icons";

const SettingsControlPage = () => {
    const { TabPane } = Tabs;
    const {generalSettingsStore} = useMobxStores()

    const [formForSec] = Form.useForm()

    useEffect(() => {
        generalSettingsStore.getGeneralSettings().then((response) => {
            debugger
            formForSec.setFieldValue("min_password", response.response.data[0].min_password_length)
        });
    }, []);

    return (
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl mb-2">Настройки</h1>
                </div>
                <Divider />

                <Tabs defaultActiveKey="1" tabPosition="top">
                    {/* Platform-wide Settings */}
                    <TabPane tab="Общие настройки" key="1">
                        <Form layout="vertical">
                            <Form.Item label="Название платформы">
                                <Input placeholder="Введите название платформы" />
                            </Form.Item>
                            <Form.Item label="Логотип URL">
                                <Input placeholder="Введите URL логотипа" />
                            </Form.Item>
                            <Form.Item label="Режим обслуживания">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            {/*<Form.Item label="Частота обновления данных">*/}
                            {/*    <Segmented<string>*/}
                            {/*        options={['Ежедневно', 'Еженедельно', 'Ежемесячно', 'Ежеквартально', 'Ежегодно']}*/}
                            {/*        onChange={(value) => {*/}
                            {/*            console.log(value); // string*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Язык по умолчанию">*/}
                            {/*    <Select defaultValue="ru">*/}
                            {/*        <Select.Option value="en">Английский</Select.Option>*/}
                            {/*        <Select.Option value="ru">Русский</Select.Option>*/}
                            {/*        <Select.Option value="es">Испанский</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Включить GDPR">*/}
                            {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                            {/*</Form.Item>*/}
                            {/* Новые настройки */}
                            {/*<Form.Item label="Тема оформления">*/}
                            {/*    <Select defaultValue="light">*/}
                            {/*        <Select.Option value="light">Светлая</Select.Option>*/}
                            {/*        <Select.Option value="dark">Тёмная</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Фоновое изображение">*/}
                            {/*    <Input placeholder="Введите URL фонового изображения" />*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Срок действия сессии">*/}
                            {/*    <InputNumber min={5} max={120} defaultValue={30} /> минут*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Настройки автоматического обновления интерфейса">*/}
                            {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Частота обновления интерфейса">*/}
                            {/*    <Select defaultValue="10">*/}
                            {/*        <Select.Option value="5">Каждые 5 секунд</Select.Option>*/}
                            {/*        <Select.Option value="10">Каждые 10 секунд</Select.Option>*/}
                            {/*        <Select.Option value="30">Каждые 30 секунд</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Мультиязычность интерфейса">*/}
                            {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Настройка часового пояса">*/}
                            {/*    <Select defaultValue="UTC">*/}
                            {/*        <Select.Option value="UTC">UTC</Select.Option>*/}
                            {/*        <Select.Option value="GMT">GMT</Select.Option>*/}
                            {/*        <Select.Option value="EST">EST</Select.Option>*/}
                            {/*        <Select.Option value="PST">PST</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            <Form.Item label="Настройки кэширования данных">
                                <Select defaultValue="enabled">
                                    <Select.Option value="enabled">Включено</Select.Option>
                                    <Select.Option value="disabled">Отключено</Select.Option>
                                </Select>
                            </Form.Item>
                            {/*<Form.Item label="Тестовые данные">*/}
                            {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                            {/*</Form.Item>*/}
                            <Form.Item label="Настройки для разработчиков">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* User Management Settings */}
                    <TabPane tab="Управление пользователями" key="2">
                        <Form layout="vertical">
                            <Form.Item label="Роль пользователя по умолчанию">
                                <Select placeholder="Выберите роль">
                                    <Select.Option value="admin">Администратор</Select.Option>
                                    <Select.Option value="instructor">Инструктор</Select.Option>
                                    <Select.Option value="student">Студент</Select.Option>
                                    <Select.Option value="moderator">Модератор</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Автоматическое подтверждение регистрации">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <Tooltip title="Включение автоматического подтверждения регистрации: при регистрации нового пользователя, система автоматически отправит им подтверждение email, чтобы обеспечить безопасность и ускорить процесс регистрации">
                                    <InfoCircleOutlined className="ml-2 text-gray-500" />
                                </Tooltip>
                            </Form.Item>
                            <Form.Item label="Минимальный возраст для регистрации">
                                <InputNumber min={13} max={100} defaultValue={18} />
                            </Form.Item>
                            <Form.Item label="Уведомления о жалобах пользователей">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <Tooltip title="Включение уведомлений о новых жалобах пользователей: вы будете получать уведомления каждый раз, когда новый отзыв или жалоба поступает в систему">
                                    <InfoCircleOutlined className="ml-2 text-gray-500" />
                                </Tooltip>
                            </Form.Item>
                            {/*<Form.Item label="Настройки уровней доступа для ролей">*/}
                            {/*    <Select defaultValue="basic">*/}
                            {/*        <Select.Option value="basic">Базовый</Select.Option>*/}
                            {/*        <Select.Option value="advanced">Расширенный</Select.Option>*/}
                            {/*        <Select.Option value="admin">Администратор</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            <Form.Item label="Период неактивности до блокировки аккаунта, дней">
                                <InputNumber min={1} max={365} defaultValue={30} />
                            </Form.Item>
                            <Form.Item label="Панель мониторинга активности пользователей">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <Tooltip title="Панель мониторинга активности пользователей: позволяет администратору отслеживать действия пользователей на сайте, что помогает обнаруживать потенциальные нарушения безопасности и обеспечивает более эффективное управление контентом">
                                    <InfoCircleOutlined className="ml-2 text-gray-500" />
                                </Tooltip>
                            </Form.Item>
                            <Form.Item label="Частота обновления данных на панели">
                                <Select defaultValue="5_minutes">
                                    <Select.Option value="1_minute">1 минута</Select.Option>
                                    <Select.Option value="5_minutes">5 минут</Select.Option>
                                    <Select.Option value="15_minutes">15 минут</Select.Option>
                                </Select>
                            </Form.Item>
                            {/*<Form.Item label="Уровень уведомлений для пользователей">*/}
                            {/*    <Select defaultValue="all">*/}
                            {/*        <Select.Option value="all">Все уведомления</Select.Option>*/}
                            {/*        <Select.Option value="important">Только важные</Select.Option>*/}
                            {/*        <Select.Option value="none">Без уведомлений</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Персонализация интерфейса для ролей">*/}
                            {/*    <Select defaultValue="default">*/}
                            {/*        <Select.Option value="default">Стандартный</Select.Option>*/}
                            {/*        <Select.Option value="custom">Кастомизированный</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Блокировка пользователей по регионам">*/}
                            {/*    <Select mode="multiple" placeholder="Выберите регионы для блокировки">*/}
                            {/*        <Select.Option value="us">США</Select.Option>*/}
                            {/*        <Select.Option value="eu">Европа</Select.Option>*/}
                            {/*        <Select.Option value="asia">Азия</Select.Option>*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* Course Management Settings */}
                    <TabPane tab="Управление курсами" key="3">
                        <Form layout="vertical">
                            <Form.Item label="Шаблон для создания курса">
                                <Input.TextArea rows={4} placeholder="Введите шаблон" />
                            </Form.Item>
                            <Form.Item label="Автоматическая публикация курсов">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item label="Минимальное количество студентов для начала курса">
                                <InputNumber min={1} max={100} defaultValue={5} />
                            </Form.Item>
                            <Form.Item label="Максимальный размер файла для загрузки (МБ)">
                                <InputNumber min={1} max={1000} defaultValue={100} />
                            </Form.Item>
                            <Form.Item label="Модерация отзывов на курсы">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item label="Дата начала курса">
                                <DatePicker placeholder="Выберите дату начала" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Дата окончания курса">
                                <DatePicker placeholder="Выберите дату окончания" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Автоматические напоминания о завершении курса">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item label="Частота напоминаний">
                                <Select defaultValue="1_week">
                                    <Select.Option value="1_day">1 день</Select.Option>
                                    <Select.Option value="3_days">3 дня</Select.Option>
                                    <Select.Option value="1_week">1 неделя</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Создание групп студентов">
                                <Input placeholder="Введите название группы" />
                            </Form.Item>
                            <Form.Item label="Добавить студентов в группу">
                                <Select mode="multiple" placeholder="Выберите студентов">
                                    {/* Вставьте список студентов */}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Выдача сертификатов по завершению курса">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item label="Шаблон сертификата">
                                <Input.TextArea rows={4} placeholder="Введите шаблон сертификата" />
                            </Form.Item>
                            <Form.Item label="Модерация новых курсов перед публикацией">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item label="Интеграция с платформами для онлайн-занятий">
                                <Select defaultValue="zoom">
                                    <Select.Option value="zoom">Zoom</Select.Option>
                                    <Select.Option value="teams">Microsoft Teams</Select.Option>
                                    <Select.Option value="google_meet">Google Meet</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ограничение доступа к материалам по времени">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                            </Form.Item>
                            <Form.Item label="Интеграция с Learning Management Systems (LMS)">
                                <Input placeholder="Введите параметры интеграции" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* Financial Settings */}
                    <TabPane tab="Финансовые настройки" key="4">
                        <Form layout="vertical">
                            <Form.Item label="Платежный шлюз по умолчанию">
                                <Select defaultValue="stripe">
                                    <Select.Option value="stripe">Stripe</Select.Option>
                                    <Select.Option value="paypal">PayPal</Select.Option>
                                    <Select.Option value="bank">Банковский перевод</Select.Option>
                                    <Select.Option value="crypto">Криптовалюты</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите платежный шлюз, который будет использоваться по умолчанию.
                                </div>
                            </Form.Item>
                            <Form.Item label="Минимальная сумма для вывода средств">
                                <InputNumber min={10} max={10000} defaultValue={100} />
                                <div className="text-gray-500 mt-1">
                                    Установите минимальную сумму, необходимую для вывода средств.
                                </div>
                            </Form.Item>
                            <Form.Item label="Комиссия за транзакцию (%)">
                                <InputNumber min={0} max={100} defaultValue={2.5} />
                                <div className="text-gray-500 mt-1">
                                    Установите процент комиссии за транзакции.
                                </div>
                            </Form.Item>
                            <Form.Item label="Периодичность выплат инструкторам">
                                <Select defaultValue="monthly">
                                    <Select.Option value="weekly">Еженедельно</Select.Option>
                                    <Select.Option value="biweekly">Каждые две недели</Select.Option>
                                    <Select.Option value="monthly">Ежемесячно</Select.Option>
                                    <Select.Option value="quarterly">Ежеквартально</Select.Option>
                                    <Select.Option value="yearly">Ежегодно</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите, как часто вы будете выплачивать гонорары инструкторам.
                                </div>
                            </Form.Item>
                            <Form.Item label="Настройка автоматических счетов">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включите автоматическую генерацию счетов для транзакций и выплат.
                                </div>
                            </Form.Item>
                            <Form.Item label="Настройки налоговых ставок">
                                <Form.Item label="Налоговая ставка (%)">
                                    <InputNumber min={0} max={100} defaultValue={20} />
                                    <div className="text-gray-500 mt-1">
                                        Установите налоговую ставку, которая будет применяться к транзакциям.
                                    </div>
                                </Form.Item>
                                <Form.Item label="Налоговые категории">
                                    <Select mode="multiple" placeholder="Выберите категории налога">
                                        <Select.Option value="vat">НДС</Select.Option>
                                        <Select.Option value="sales">Налог с продаж</Select.Option>
                                        <Select.Option value="income">Подоходный налог</Select.Option>
                                    </Select>
                                    <div className="text-gray-500 mt-1">
                                        Выберите налоговые категории, которые будут применяться к транзакциям.
                                    </div>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Настройки кэшбэка">
                                <Form.Item label="Процент кэшбэка">
                                    <InputNumber min={0} max={100} defaultValue={5} />
                                    <div className="text-gray-500 mt-1">
                                        Установите процент кэшбэка для покупателей, который будет начисляться на их аккаунт.
                                    </div>
                                </Form.Item>
                                <Form.Item label="Минимальная сумма для использования кэшбэка">
                                    <InputNumber min={0} max={10000} defaultValue={10} />
                                    <div className="text-gray-500 mt-1">
                                        Установите минимальную сумму, которую необходимо потратить, чтобы использовать кэшбэк.
                                    </div>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Интеграция с бухгалтерскими системами">
                                <Select defaultValue="quickbooks">
                                    <Select.Option value="quickbooks">QuickBooks</Select.Option>
                                    <Select.Option value="xero">Xero</Select.Option>
                                    <Select.Option value="freshbooks">FreshBooks</Select.Option>
                                    <Select.Option value="wave">Wave</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите бухгалтерскую систему для интеграции с вашей платформой.
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* Security Settings */}
                    <TabPane tab="Настройки безопасности" key="5">
                        <Form
                            form={formForSec}
                            layout="vertical"
                            onFinish={(values) => {
                                debugger
                                return generalSettingsStore.saveGeneralSetting(formForSec.getFieldsValue());
                            }}
                        >
                            <Form.Item
                                label="Двухфакторная аутентификация (2FA)"
                                valuePropName="2fa_value"
                            >
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Позволяет добавить дополнительный уровень безопасности через двухфакторную аутентификацию.
                                </div>
                            </Form.Item>
                            <Form.Item label="IP Белый список" name="white_ips">
                                <Input placeholder="Введите IP-адреса через запятую" />
                                <div className="text-gray-500 mt-1">
                                    Ограничивает доступ к админ-панели только для указанных IP-адресов.
                                </div>
                            </Form.Item>
                            <Form.Item label="Автоматические резервные копии" name="auto_backups">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включение этой опции обеспечивает регулярное создание резервных копий данных.
                                </div>
                            </Form.Item>
                            <Form.Item label="Журнал аудита" name="audit">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включает ведение журнала аудита для отслеживания всех административных действий.
                                </div>
                            </Form.Item>
                            <Form.Item label="Минимальная длина пароля" name="min_password">
                                <InputNumber min={6} max={20} />
                                <div className="text-gray-500 mt-1">
                                    Устанавливает минимальную длину пароля для пользователей, чтобы повысить безопасность учетных записей.
                                </div>
                            </Form.Item>
                            <Form.Item label="Сложность пароля" name="complexity_password">
                                <Select defaultValue="medium">
                                    <Select.Option value="low">Низкая</Select.Option>
                                    <Select.Option value="medium">Средняя</Select.Option>
                                    <Select.Option value="high">Высокая</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Настройка требований к сложности пароля, например, наличие символов, цифр и специальных символов.
                                </div>
                            </Form.Item>
                            <Form.Item label="Ограничение по IP-адресам для попыток входа">
                                <InputNumber min={1} max={10} defaultValue={5} />
                                <div className="text-gray-500 mt-1">
                                    Устанавливает максимальное количество неудачных попыток входа с одного IP-адреса.
                                </div>
                            </Form.Item>
                            <Form.Item label="Шифрование данных">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включает шифрование данных, хранящихся в базе данных, для повышения уровня безопасности.
                                </div>
                            </Form.Item>
                            <Form.Item label="Время блокировки учетной записи после нескольких неудачных попыток входа">
                                <InputNumber min={1} max={60} defaultValue={15} /> минут
                                <div className="text-gray-500 mt-1">
                                    Устанавливает время блокировки учетной записи после нескольких неудачных попыток входа.
                                </div>
                            </Form.Item>
                            <Form.Item style={{marginTop: '22px'}}>
                                <Button type="primary" htmlType="submit"
                                        style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                    Зарегистрироваться
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* Communication Tools */}
                    <TabPane tab="Инструменты связи" key="6">
                        <Form layout="vertical">
                            <Form.Item label="Шаблон email уведомлений">
                                <Input.TextArea rows={4} placeholder="Введите шаблон email уведомлений" />
                                <div className="text-gray-500 mt-1">
                                    Определите шаблоны для различных типов уведомлений, таких как подтверждение регистрации, сброс пароля и т.д.
                                </div>
                            </Form.Item>
                            <Form.Item label="Настройки SMS уведомлений">
                                <Input placeholder="Введите API ключ для SMS сервиса" />
                                <div className="text-gray-500 mt-1">
                                    Введите API ключ для интеграции с вашим SMS сервисом.
                                </div>
                            </Form.Item>
                            <Form.Item label="Поддержка в реальном времени">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включите поддержку чата в реальном времени для общения с пользователями.
                                </div>
                            </Form.Item>
                            <Form.Item label="Настройки веб-пуш уведомлений">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включите веб-пуш уведомления для обновлений и важных оповещений на платформе.
                                </div>
                            </Form.Item>
                            <Form.Item label="Интеграция с мессенджерами">
                                <Select mode="multiple" placeholder="Выберите мессенджеры для интеграции">
                                    <Select.Option value="whatsapp">WhatsApp</Select.Option>
                                    <Select.Option value="telegram">Telegram</Select.Option>
                                    <Select.Option value="facebook">Facebook Messenger</Select.Option>
                                    <Select.Option value="slack">Slack</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите мессенджеры, с которыми будет интегрирована ваша платформа.
                                </div>
                            </Form.Item>
                            <Form.Item label="Настройка автоматических ответов">
                                <Form.Item label="Время ответа (в часах)">
                                    <InputNumber min={0} max={24} defaultValue={1} />
                                    <div className="text-gray-500 mt-1">
                                        Установите время в часах для автоматического ответа на запросы пользователей.
                                    </div>
                                </Form.Item>
                                <Form.Item label="Шаблон автоматического ответа">
                                    <Input.TextArea rows={4} placeholder="Введите шаблон автоматического ответа" />
                                    <div className="text-gray-500 mt-1">
                                        Определите текст автоматического ответа, который будет отправляться пользователям.
                                    </div>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Статистика коммуникаций">
                                <Form.Item label="Период статистики">
                                    <Select defaultValue="monthly">
                                        <Select.Option value="daily">Ежедневно</Select.Option>
                                        <Select.Option value="weekly">Еженедельно</Select.Option>
                                        <Select.Option value="monthly">Ежемесячно</Select.Option>
                                        <Select.Option value="quarterly">Ежеквартально</Select.Option>
                                    </Select>
                                    <div className="text-gray-500 mt-1">
                                        Выберите период, за который будет генерироваться статистика коммуникаций.
                                    </div>
                                </Form.Item>
                                <Form.Item label="Включить графики и отчеты">
                                    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                    <div className="text-gray-500 mt-1">
                                        Включите отображение графиков и отчетов по коммуникациям для анализа.
                                    </div>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* Custom Branding */}
                    <TabPane tab="Кастомизация и брендинг" key="7">
                        <Form layout="vertical">
                            <Form.Item label="Тема по умолчанию">
                                <Select defaultValue="light">
                                    <Select.Option value="light">Светлая</Select.Option>
                                    <Select.Option value="dark">Тёмная</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Цветовая схема">
                                <Input placeholder="Введите цветовой код (например, #1890ff)" />
                            </Form.Item>
                            <Form.Item label="Фоновое изображение">
                                <Input placeholder="Введите URL фонового изображения" />
                                <div className="text-gray-500 mt-1">
                                    Загрузите фоновое изображение для страницы входа или основного экрана.
                                </div>
                            </Form.Item>
                            <Form.Item label="Шрифт по умолчанию">
                                <Select defaultValue="arial">
                                    <Select.Option value="arial">Arial</Select.Option>
                                    <Select.Option value="times">Times New Roman</Select.Option>
                                    <Select.Option value="courier">Courier New</Select.Option>
                                    <Select.Option value="roboto">Roboto</Select.Option>
                                    <Select.Option value="open-sans">Open Sans</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите шрифт по умолчанию для заголовков и текста на платформе.
                                </div>
                            </Form.Item>
                            <Form.Item label="Иконки и эмодзи">
                                <Select mode="multiple" placeholder="Выберите иконки">
                                    <Select.Option value="home">Дом</Select.Option>
                                    <Select.Option value="settings">Настройки</Select.Option>
                                    <Select.Option value="user">Пользователь</Select.Option>
                                    <Select.Option value="notification">Уведомление</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите иконки для различных функций и разделов платформы.
                                </div>
                            </Form.Item>
                            <Form.Item label="Анимации и переходы">
                                <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
                                <div className="text-gray-500 mt-1">
                                    Включите анимации и переходы для улучшения пользовательского опыта.
                                </div>
                            </Form.Item>
                            <Form.Item label="Кастомизация кнопок">
                                <Form.Item label="Форма кнопок">
                                    <Select defaultValue="rounded">
                                        <Select.Option value="rounded">Закругленные углы</Select.Option>
                                        <Select.Option value="square">Прямоугольные</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Цвет кнопок">
                                    <Input placeholder="Введите цветовой код (например, #ff5733)" />
                                </Form.Item>
                                <Form.Item label="Иконки на кнопках">
                                    <Select mode="multiple" placeholder="Выберите иконки для кнопок">
                                        <Select.Option value="save">Сохранить</Select.Option>
                                        <Select.Option value="edit">Редактировать</Select.Option>
                                        <Select.Option value="delete">Удалить</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="Предпросмотр изменений">
                                <Button type="default">Посмотреть изменения</Button>
                                <div className="text-gray-500 mt-1">
                                    Нажмите, чтобы просмотреть изменения в реальном времени.
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>


                    {/* Advanced Reporting */}
                    <TabPane tab="Расширенная аналитика" key="8">
                        <Form layout="vertical">
                            <Form.Item label="Настройка отчетов">
                                <Select mode="multiple" placeholder="Выберите типы отчетов">
                                    <Select.Option value="user_activity">Активность пользователей</Select.Option>
                                    {/*<Select.Option value="financial">Финансовые отчеты</Select.Option>*/}
                                    <Select.Option value="course_performance">Эффективность курсов</Select.Option>
                                    <Select.Option value="engagement">Уровень вовлеченности</Select.Option>
                                    <Select.Option value="content_quality">Качество контента</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Выберите типы отчетов, которые вы хотите настраивать и просматривать.
                                </div>
                            </Form.Item>
                            <Form.Item label="Частота отчетов">
                                <Select defaultValue="monthly">
                                    <Select.Option value="daily">Ежедневно</Select.Option>
                                    <Select.Option value="weekly">Еженедельно</Select.Option>
                                    <Select.Option value="monthly">Ежемесячно</Select.Option>
                                    <Select.Option value="quarterly">Ежеквартально</Select.Option>
                                    <Select.Option value="yearly">Ежегодно</Select.Option>
                                </Select>
                                <div className="text-gray-500 mt-1">
                                    Установите частоту, с которой будут генерироваться отчеты.
                                </div>
                            </Form.Item>
                            {/*<Form.Item label="Включить тепловые карты">*/}
                            {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                            {/*    <div className="text-gray-500 mt-1">*/}
                            {/*        Включение тепловых карт для визуализации активности пользователей на сайте.*/}
                            {/*    </div>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Настройка пороговых значений для уведомлений">*/}
                            {/*    <Form.Item label="Минимальный порог активности пользователей">*/}
                            {/*        <InputNumber min={0} defaultValue={100} />*/}
                            {/*        <div className="text-gray-500 mt-1">*/}
                            {/*            Установите минимальный порог для активности пользователей, при котором будут отправляться уведомления.*/}
                            {/*        </div>*/}
                            {/*    </Form.Item>*/}
                            {/*    <Form.Item label="Минимальный порог для финансовых показателей">*/}
                            {/*        <InputNumber min={0} defaultValue={5000} />*/}
                            {/*        <div className="text-gray-500 mt-1">*/}
                            {/*            Установите порог для финансовых показателей, при котором будут отправляться уведомления.*/}
                            {/*        </div>*/}
                            {/*    </Form.Item>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="Включить прогнозные аналитические отчеты">*/}
                            {/*    <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />*/}
                            {/*    <div className="text-gray-500 mt-1">*/}
                            {/*        Позволяет включить прогнозные отчеты для анализа будущих тенденций на основе исторических данных.*/}
                            {/*    </div>*/}
                            {/* </Form.Item> */}
                            <Form.Item label="Параметры фильтрации данных">
                                <Form.Item label="Фильтр по дате">
                                    <DatePicker.RangePicker />
                                    <div className="text-gray-500 mt-1">
                                        Установите диапазон дат для фильтрации данных в отчетах.
                                    </div>
                                </Form.Item>
                                {/*<Form.Item label="Фильтр по пользователям">*/}
                                {/*    <Select mode="multiple" placeholder="Выберите пользователей">*/}
                                {/*        <Select.Option value="user1">Пользователь 1</Select.Option>*/}
                                {/*        <Select.Option value="user2">Пользователь 2</Select.Option>*/}
                                {/*        <Select.Option value="user3">Пользователь 3</Select.Option>*/}
                                {/*    </Select>*/}
                                {/*    <div className="text-gray-500 mt-1">*/}
                                {/*        Выберите пользователей для фильтрации данных в отчетах.*/}
                                {/*    </div>*/}
                                {/*</Form.Item>*/}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Сохранить изменения</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                </Tabs>
            </div>
        </div>
    )
}

export default observer(SettingsControlPage);
