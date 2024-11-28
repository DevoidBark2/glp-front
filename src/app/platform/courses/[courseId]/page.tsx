"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Menu, Layout, Card, Progress, Button, Dropdown, Popover, Divider, Tooltip } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftOutlined, ArrowRightOutlined, DownOutlined, LogoutOutlined, ToolOutlined, SettingOutlined, EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Header } from "antd/es/layout/layout";
import { CourseComponentType } from "@/shared/api/course/model";
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
    const [progress, setProgress] = useState(0);

    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = ({ key }: any) => {
        debugger
        setSelectedSection(key);
        // updateStepInUrl(key);
    };

    const router = useRouter()

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => router.back()}>
                Выйти из курса
            </Menu.Item>
        </Menu>
    );

    const courseDetailsContent = (
        <div>
            <p>Всего заданий: 100</p>
            <p>Сложных заданий: 2</p>
            <p>Легких заданий: 4</p>
            <p>Оценочное время: не указано</p>
        </div>
    );

    const items: MenuItem[] = courseStore.fullDetailCourse?.sections.map((section) => {
        // Если есть дети, добавляем как группу, иначе как обычный пункт
        if (section.children && section.children.length > 0) {
            return {
                key: section.id.toString(),
                label: (
                    <Tooltip title={section.name} placement="right">
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
                                padding: '8px 16px',
                                borderLeft: '2px solid #4caf50', // Зеленая граница
                            }}
                        >
                            {child.name}
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
            // debugger
            // const stepFromUrl = Number(searchParams.get("step"));
            // const initialSectionId = stepFromUrl || response.sections[0]?.id || 0;
            // setSelectedSection(initialSectionId);
        });
    }, [courseId]);

    return (
        <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
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
                        status="active"
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
                                <Tooltip title="Сменить тему">
                                    <Button
                                        type="text"
                                        icon={<SettingOutlined />}
                                    />
                                </Tooltip>

                                <Tooltip title="Настройки">
                                    <Button
                                        type="text"
                                        icon={<ToolOutlined />}
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
                                        <Menu.Item key="theme" icon={<SettingOutlined />} >
                                            Сменить тему
                                        </Menu.Item>
                                        <Menu.Item key="settings" icon={<ToolOutlined />} >
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
                                courseStore.fullDetailCourse?.sections.map(it => it.children.find((s) => s.id === Number(selectedSection))?.components.map((component) => {

                                    if (component.type === CourseComponentType.Text) {
                                        return <TextComponent component={component} />
                                    }
                                    if (component.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component} />;
                                    }
                                    if (component.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component} />;
                                    }
                                }))}
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(CoursePage);