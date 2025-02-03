"use client";
import React from "react";
import {Typography, Card, Divider, List, Button, Space, Collapse} from "antd";
import {PageContainerControlPanel} from "@/shared/ui";
import {CheckCircleOutlined} from "@ant-design/icons";

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const ManualPage = () => {
    return (
        <PageContainerControlPanel>
            <Typography>
                <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                    Руководство пользователя
                </Title>
                <Paragraph style={{ fontSize: "16px", textAlign: "justify", lineHeight: "1.8" }}>
                    Добро пожаловать в наше приложение! Здесь вы найдёте полное руководство по использованию всех функций.
                    Мы сделали интерфейс максимально удобным и простым в использовании. Если у вас возникли вопросы, не стесняйтесь
                    обращаться через <a href="/support">техническую поддержку</a>. Мы всегда рады помочь!
                </Paragraph>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                    <Button type="primary" size="large" href="/support">
                        Связаться с поддержкой
                    </Button>
                </div>

                <Divider />

                <Title level={3}>Основные функции</Title>
                <Paragraph style={{ fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
                    Наше приложение предоставляет широкий набор функций для удобства пользователей.
                    Вот основные возможности:
                </Paragraph>
                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={[
                        {
                            title: "Авторизация и регистрация",
                            description: "Зарегистрируйтесь или войдите в систему с использованием вашей электронной почты.",
                        },
                        {
                            title: "Панель управления",
                            description: "На главной странице отображаются ключевые данные о вашей активности.",
                        },
                        {
                            title: "Фильтрация и поиск",
                            description: "Ищите и фильтруйте данные в реальном времени для быстрого доступа к информации.",
                        },
                        {
                            title: "Экспорт данных",
                            description: "Скачивайте отчёты в формате JSON или CSV для дальнейшего анализа.",
                        },
                        {
                            title: "Журнал аудита",
                            description: "Просматривайте подробные записи всех действий пользователей в системе.",
                        },
                        {
                            title: "Настройки уведомлений",
                            description: "Настройте уведомления о событиях, чтобы быть в курсе изменений.",
                        },
                    ]}
                    renderItem={(item) => (
                        <Card style={{ marginBottom: "16px" }} hoverable>
                            <Title level={4} style={{ marginBottom: "10px", fontSize: "18px" }}>
                                {item.title}
                            </Title>
                            <Paragraph style={{ fontSize: "14px", lineHeight: "1.6" }}>{item.description}</Paragraph>
                        </Card>
                    )}
                />

                <Divider />

                <Title level={3}>Инструкции по использованию</Title>
                <Paragraph style={{ marginBottom: "20px", fontSize: "15px", lineHeight: "1.8" }}>
                    Чтобы начать использовать приложение, выполните следующие шаги:
                </Paragraph>
                <List
                    bordered
                    dataSource={[
                        "Войдите в приложение, используя свою учётную запись.",
                        "Ознакомьтесь с панелью управления, чтобы увидеть ключевые данные.",
                        "Используйте поиск и фильтры для настройки отображения.",
                        "Просматривайте журнал аудита для анализа активности пользователей.",
                        "Экспортируйте данные для дальнейшей работы.",
                    ]}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Space>
                                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                <Text>{item}</Text>
                            </Space>
                        </List.Item>
                    )}
                />

                <Divider />

                <Title level={3}>Полезные советы</Title>
                <Collapse accordion>
                    <Panel header="Совет 1: Регулярно обновляйте данные" key="1">
                        <Paragraph>
                            Для получения актуальной информации убедитесь, что данные обновлены. Нажмите на кнопку Обновить
                            на панели управления.
                        </Paragraph>
                    </Panel>
                    <Panel header="Совет 2: Используйте горячие клавиши" key="2">
                        <Paragraph>
                            Нажмите <Text code>Ctrl+F</Text> для поиска информации в длинных списках.
                        </Paragraph>
                    </Panel>
                    <Panel header="Совет 3: Настройте уведомления" key="3">
                        <Paragraph>
                            Чтобы не пропустить важные изменения, настройте уведомления в разделе Настройки.
                        </Paragraph>
                    </Panel>
                </Collapse>

                <Divider />

                <Title level={3}>Часто задаваемые вопросы (FAQ)</Title>
                <Collapse accordion>
                    <Panel header="Как восстановить пароль?" key="1">
                        <Paragraph>
                            Перейдите на страницу авторизации и нажмите на ссылку Забыли пароль?. Следуйте инструкциям для восстановления.
                        </Paragraph>
                    </Panel>
                    <Panel header="Как изменить личные данные?" key="2">
                        <Paragraph>
                            Вы можете редактировать свой профиль в разделе Настройки на панели управления.
                        </Paragraph>
                    </Panel>
                    <Panel header="Как настроить уведомления?" key="3">
                        <Paragraph>
                            Зайдите в настройки профиля и выберите типы уведомлений, которые хотите получать.
                        </Paragraph>
                    </Panel>
                </Collapse>

                <Divider />

                <Title level={3} style={{ textAlign: "center" }}>
                    Благодарим за использование нашего приложения!
                </Title>
                <Paragraph style={{ textAlign: "center", fontSize: "16px", marginTop: "10px" }}>
                    Мы работаем, чтобы ваше взаимодействие с нашим сервисом было максимально удобным. Если у вас есть
                    идеи или предложения, пишите нам в <a href="/feedback">обратной связи</a>.
                </Paragraph>
            </Typography>
        </PageContainerControlPanel>
    );
};

export default ManualPage;
