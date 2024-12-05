"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Menu, Layout, Card, Progress, Button, Dropdown, Popover, Tooltip, Modal, Form, Input, Checkbox, Select, InputNumber } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LogoutOutlined, ToolOutlined, SettingOutlined, EllipsisOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Header } from "antd/es/layout/layout";
import { Course, CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model";
import { QuizComponent } from "@/entities/course/ui/QuizComponent";
import { QuizMultiComponent } from "@/entities/course/ui/QuizMultiComponent";
import { TextComponent } from "@/entities/course/ui/TextComponent";
import { MenuItem } from "@/utils/dashboardMenu";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Открытие модального окна
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Закрытие модального окна
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Отправка данных из формы
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log('Настройки сохранены:', values);
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log('Ошибка при сохранении настроек:', info);
            });
    };

    const handleMenuClick = ({ key }: any) => {
        setSelectedSection(key);
        // Обновляем параметр step в URL, не вызывая повторный useEffect
        router.push(`/platform/courses/${courseId}?step=${key}`);
        // updateStepInUrl(key);
    };

    const courseDetailsContent = () => (
        <div>
            <p>Всего заданий: {courseStore.fullDetailCourse?.name}</p>
            <p>Сложных заданий:  {courseStore.fullDetailCourse?.name}</p>
            <p>Легких заданий:  {courseStore.fullDetailCourse?.name}</p>
            <p>Оценочное время:  {courseStore.fullDetailCourse?.name}</p>
        </div>
    );

    const renderIconCountAnswerUser = (quiz: any) => {
        // Проверяем, существует ли quiz и имеет ли он sectionComponents
        if (!quiz || !quiz.sectionComponents) {
            return null;
        }

        // Извлекаем userAnswer из всех componentTask
        const quizItems = quiz.sectionComponents
            .map((it) => it.componentTask?.userAnswer)
            .filter((userAnswer) => userAnswer !== null && userAnswer !== undefined); // Убираем null и undefined

        const totalQuestions = quiz.sectionComponents.length; // Общее количество заданий
        let icon = null;
        let tooltipTitle = "";

        // Если ответы отсутствуют
        if (quizItems.length === 0) {
            icon = <QuestionCircleOutlined style={{ color: "gray", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Всего заданий: ${totalQuestions}. Пока нет сданных заданий.`;
            return (
                <Tooltip title={tooltipTitle} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                    {icon}
                </Tooltip>
            );
        }

        // Подсчитываем количество правильных ответов
        const correctAnswersCount = quizItems.filter((answer) => answer.isCorrect).length;

        // Выбираем иконку и сообщение в зависимости от результата
        if (correctAnswersCount === totalQuestions) {
            icon = <CheckCircleOutlined style={{ color: "green", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Все задания выполнены верно (${correctAnswersCount}/${totalQuestions})`;
        } else if (correctAnswersCount === 0) {
            icon = <CloseCircleOutlined style={{ color: "red", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Все задания выполнены неверно (0/${totalQuestions})`;
        } else {
            icon = <ExclamationCircleOutlined style={{ color: "orange", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Часть заданий выполнена верно (${correctAnswersCount}/${totalQuestions})`;
        }

        // Возвращаем результат с тултипом
        return (
            <Tooltip title={tooltipTitle} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                {icon}
            </Tooltip>
        );
    };


    const items: MenuItem[] = courseStore.fullDetailCourse?.sections.map((section) => {
        // Если есть дети, добавляем как группу, иначе как обычный пункт
        if (section.children && section.children.length > 0) {
            return {
                key: section.id.toString(),
                label: (
                    <Tooltip title={collapsed && section.name} placement="right">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: collapsed ? 'center' : 'flex-start', // Центрируем текст, если collapsed
                                overflow: 'hidden', // Прячем текст, если не влезает
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    whiteSpace: 'nowrap', // Предотвращаем перенос
                                    textOverflow: 'ellipsis', // Сокращаем текст, если не помещается
                                    overflow: 'hidden', // Скрываем лишний текст
                                }}
                            >
                                {section.name}
                            </span>
                        </div>
                    </Tooltip>
                ),

                icon: <ExclamationCircleOutlined style={{ color: '#d32f2f' }} />,
                type: 'group', // Главный раздел как группа
                children: section.children.map((child, index) => ({
                    key: child.id.toString(),
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                padding: '8px 16px',
                                borderLeft: '2px solid #4caf50',
                            }}
                        >
                            <p>{child.name}</p>
                            {renderIconCountAnswerUser(child)}
                        </div>
                    ),
                    icon: (
                        <span
                            className={``}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                                color: '#555',
                                fontSize: '12px',
                                marginTop: collapsed ? '8px' : undefined, // Применяем только если collapsed = true
                                marginLeft: collapsed ? '-3px' : undefined, // Применяем только если collapsed = true
                            }}
                        >
                            {index + 1}
                        </span>
                    )
                })),
            };
        }
        return {
            key: section.id.toString(),

            label: (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderLeft: '2px solid #4caf50', // Зеленая граница
                    }}
                >
                    <span
                        style={{
                            fontWeight: 'bold',
                            color: '#d32f2f', // Красный цвет текста
                        }}
                    >
                        {section.name}
                    </span>
                </div>
            ),
            icon: <ExclamationCircleOutlined style={{ color: '#d32f2f' }} />,
        };
    }) || [];






    const handleToggle = () => {
        setCollapsed(!collapsed); // Переключение состояния
    };
    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            const stepFromUrl = Number(searchParams.get("step"));
            debugger
            const initialSectionId = stepFromUrl || response.sections[0]?.children[0]?.id;
            setSelectedSection(initialSectionId);

            // Если в URL нет параметра step, добавляем его
            if (!stepFromUrl) {
                router.push(`/platform/courses/${courseId}?step=${initialSectionId}`);
            }
        });
    }, [courseId]);


    return (
        <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>

            {/* Модалка с настройками */}
            <Modal
                title="Настройки курса"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="showProgress"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>Показывать прогресс прохождения</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="enableNotifications"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>Включить уведомления</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="timerDuration"
                        label="Таймер на вопрос (в секундах)"
                        rules={[{ type: 'number', min: 10, max: 300, message: 'Введите значение от 10 до 300' }]}
                    >
                        <InputNumber min={10} max={300} placeholder="Введите время" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="questionDifficulty"
                        label="Сложность вопросов"
                    >
                        <Select placeholder="Выберите сложность">
                            <Select.Option value="easy">Легкий</Select.Option>
                            <Select.Option value="medium">Средний</Select.Option>
                            <Select.Option value="hard">Сложный</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="trainingMode"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Checkbox>Режим тренировки (показ ответов после вопроса)</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="retryErrorsOnly"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Checkbox>Повторно проходить только ошибки</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>

            <Header
                className="fixed w-full top-0 left-0 z-50"
                style={{
                    padding: '0 24px',
                    backgroundColor: '#001529',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px',
                }}
            >
                <Popover content={courseDetailsContent} placement="topLeft" title="Информация о курсе" trigger="hover">
                    <h1 className="text-xl font-bold text-white cursor-pointer">
                        {courseStore.fullDetailCourse?.name || 'Название курса'}
                    </h1>
                </Popover>

                <div style={{ flex: 1, margin: '0 16px' }}>
                    <Progress
                        percent={20}
                        strokeColor="green" // Цвет прогресса
                        trailColor="#CCCCCC" // Цвет заднего трека (для контраста)
                        showInfo={true}
                        format={(percent) => (
                            <span className="text-white font-bold">{percent}%</span> // Цвет и стиль текста
                        )}
                        style={{
                            color: 'green', // Цвет самого блока прогресса
                        }}
                    />
                </div>
            </Header>

            <Layout style={{ marginTop: 64 }}>
                <Sider

                    collapsed={collapsed}
                    width={300}
                    className="site-layout-background"
                    style={{
                        height: 'calc(100vh - 64px)',
                        position: 'fixed',
                        overflowY: 'auto',
                        borderTop: "1px solid white",
                        top: 64,
                    }}
                >
                    <div className="flex justify-end m-3">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={handleToggle}
                            style={{
                                background: 'white',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                            }}
                        />
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedSection.toString()]}
                        items={items}
                        onClick={handleMenuClick}
                        style={{
                            height: 'calc(100% - 60px)', // Уменьшаем высоту меню для кнопок снизу
                            overflowY: 'auto',
                        }}
                    />
                    {/* Кнопки внизу */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '14px',
                            borderTop: '1px solid #ddd',
                            background: '#fff',
                            display: 'flex',
                            justifyContent: collapsed ? 'center' : 'space-between', // Центрируем кнопки, если меню свернуто
                            gap: '10px', // Промежутки между кнопками
                        }}
                    >
                        {/* Меню кнопок */}
                        {!collapsed ? (
                            <>
                                <Tooltip title="Настройки">
                                    <Button
                                        type="text"
                                        icon={<ToolOutlined />}
                                        onClick={showModal}
                                    />
                                </Tooltip>

                                <Tooltip title="Выход">
                                    <Button
                                        type="text"
                                        icon={<LogoutOutlined />}
                                        onClick={() => router.push('/platform/courses')}
                                    />
                                </Tooltip>
                            </>
                        ) : (
                            <Dropdown
                                trigger={['click']}
                                overlay={
                                    <Menu>
                                        <Menu.Item key="settings" icon={<ToolOutlined />} onClick={showModal} >
                                            Настройки
                                        </Menu.Item>
                                        <Menu.Item key="logout" icon={<LogoutOutlined />} >
                                            Выход
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <Button
                                    type="text"
                                    icon={<EllipsisOutlined />} // Иконка троеточия
                                />
                            </Dropdown>
                        )}
                    </div>

                </Sider>


                <Layout style={{ marginLeft: collapsed ? 80 : 300 }}>
                    <Content
                        style={{
                            margin: 0,
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#f5f5f5',
                            height: 'calc(100vh - 64px)',
                            overflowY: 'auto',
                        }}
                    >
                        <Card
                            bordered={false}
                            title={
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 my-4">
                                        {
                                            courseStore.fullDetailCourse?.sections
                                                .flatMap(section => section.children || []) // Получаем все подразделы
                                                .find(child => child.id === Number(selectedSection))?.name || 'Section Name'
                                        }
                                    </h2>
                                </>
                            }
                        >
                            {
                                courseStore.fullDetailCourse?.sections.map(it => it.children.find((s) => s.id === Number(selectedSection))?.sectionComponents.map((component) => {
                                    if (component.componentTask.type === CourseComponentType.Text) {
                                        return <TextComponent key={component.id} component={component.componentTask} />
                                    }
                                    if (component.componentTask.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component.componentTask} currentSection={selectedSection} />;
                                    }
                                    if (component.componentTask.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component.componentTask} />;
                                    }
                                }))}


                            <div className="flex justify-end">
                                <Button type="primary">Следующий шаг</Button>
                            </div>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(CoursePage);