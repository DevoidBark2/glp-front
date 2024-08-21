"use client"
import React, {useState} from "react";
import {Divider, Menu, MenuProps} from "antd";
import {
    AppstoreOutlined,
    TeamOutlined,
    BarsOutlined,
    LogoutOutlined, SettingOutlined, ToolOutlined, BookOutlined, PartitionOutlined, SolutionOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image"

interface LayoutProps {
    children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'moderators_items',
        label: <p>Панель модератора</p>,
        icon: <ToolOutlined />,
        children: [
            {
                key: 'manage-courses',
                label: <Link href={"/control_panel/courses"}>Управление курсами</Link>,
                icon: <BookOutlined />,
            },
            {
                key: 'manage-sections',
                label: <Link href={"/control_panel/sections"}>Управление разделами</Link>,
                icon: <PartitionOutlined />,
            },
            {
                key: 'manage-tasks',
                label: <Link href={"/control_panel/tasks"}>Управление задачами</Link>,
                icon: <SolutionOutlined />
            },
        ]
    },
    {
        key: 'home',
        label: <Link href={"/control_panel"}>Главная</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'courses',
        label: <p>Курсы</p>,
        icon: <BarsOutlined />,
        children: [
            {
                key: 'your-courses',
                label: <Link href={"/control_panel/courses"}>Ваши курсы</Link>,
                icon: <BarsOutlined />,
            },
            {
                key: 'sections',
                label: <Link href={"/control_panel/sections"}>Разделы</Link>,
                icon: <BarsOutlined />,
            },
            {
                key: 'tasks',
                label: <Link href={"/control_panel/tasks"}>Компоненты</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'posts',
        label: <Link href={"/control_panel/posts"}>Посты</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'banners',
        label: <Link href={"/control_panel/banners"}>Баннеры</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'students',
        label: <Link href={"/control_panel/students"}>Студенты</Link>,
        icon: <TeamOutlined />,
    },
    {
        key: 'settings',
        label: <Link href={"/control_panel/settings"}>Настройки</Link>,
        icon: <SettingOutlined />,
    },
    {
        key: 'platform',
        label: <Link href={"/platform"}>Вернуться на платформу</Link>,
        icon: <LogoutOutlined />,
    },
    {
        key: 'nomenclature',
        label: <p>Справочники</p>,
        icon: <BarsOutlined />,
        children: [
            {
                key: 'category',
                label: <Link href={"/control_panel/category"}>Категории</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'logging',
        label: <p>Логирование</p>,
        icon: <BarsOutlined />,
        children: [
            {
                key: 'events',
                label: <Link href={"/control_panel/events"}>События пользователей</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'users',
        label: <Link href={"/control_panel/users"}>Пользователи</Link>,
        icon: <BarsOutlined />,
    },
];
const ControlPanelLayout: React.FC<LayoutProps> = ({ children }) => {

    const [showTooltip, setShowTooltip] = useState(false);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className="flex bg-gradient-to-r from-green-400 via-green-500 to-green-600">
            <div className="flex flex-col bg-gray-800 h-screen p-6 shadow-lg">
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="relative mb-4">
                        <div className="relative rounded-full bg-gradient-to-r from-green-400 via-blue-500
                        to-purple-600 h-24 w-24 flex items-center justify-center overflow-hidden shadow-xl transform
                        transition-all duration-300 hover:rotate-6 hover:scale-105">
                            <div className="absolute top-0 right-0 bg-red-600 rounded-full p-2 transform
                                transition-transform hover:scale-110 cursor-pointer shadow-lg">
                                <Image
                                    src="/static/logout_icon.svg"
                                    alt="Выйти"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-white text-lg font-bold mb-1">Петров Иван Михайлович</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-gray-300 text-sm">Администратор</span>
                        <div className="bg-green-400 h-3 w-3 rounded-full" title="Онлайн"></div>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Image
                                src="/static/light_theme_icon.svg"
                                alt="Светлая тема"
                                width={30}
                                height={30}
                                className="hover:opacity-80"
                            />
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white
                            text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity delay-150">
                                    Светлая тема
                            </span>
                        </div>
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Image
                                src="/static/notification_icon.svg"
                                alt="Уведомления"
                                width={30}
                                height={30}
                                className="hover:opacity-80"
                                onClick={toggleTooltip}
                            />
                            <div className="absolute top-0 right-0 bg-red-600 rounded-full h-4 w-4 text-xs
                            text-white flex items-center justify-center animate-bounce">3</div>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black
                                text-white text-xs rounded-lg px-2 py-1 opacity-0
                                group-hover:opacity-100 transition-opacity delay-150"
                            >
                                Уведомления</span>

                            {/*{showTooltip && (*/}
                            {/*    <div className="absolute top-0 right-12 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">*/}
                            {/*        <div className="p-4">*/}
                            {/*            <h3 className="text-sm font-semibold text-gray-800 mb-2">Уведомления</h3>*/}
                            {/*            <ul>*/}
                            {/*                <li className="text-xs text-gray-600 mb-2 border-b pb-2">Новое сообщение от Ивана</li>*/}
                            {/*                <li className="text-xs text-gray-600 mb-2 border-b pb-2">Курс был успешно обновлен</li>*/}
                            {/*                <li className="text-xs text-gray-600 mb-2">У вас запланирована встреча завтра в 15:00</li>*/}
                            {/*            </ul>*/}
                            {/*        </div>*/}
                            {/*        <div className="bg-gray-100 text-center py-2 text-blue-600 cursor-pointer hover:underline">*/}
                            {/*            Посмотреть все*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>

                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Link href={"/control_panel/settings"}>
                                <Image
                                    src="/static/settings_panel_icon.svg"
                                    alt="Настройки"
                                    width={30}
                                    height={30}
                                    className="hover:opacity-80"
                                />
                            </Link>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black
                                text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100
                                transition-opacity delay-150"
                            >Настройки</span>
                        </div>
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Link href={"/control_panel/profile"}>
                                <Image
                                    src="/static/profile_panel_icon.svg"
                                    alt="Профиль"
                                    width={30}
                                    height={30}
                                    className="hover:opacity-80"
                                />
                            </Link>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white
                                text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity delay-150"
                            >Профиль</span>
                        </div>
                    </div>
                </div>


                <Divider className="bg-gray-600"/>
                <Menu
                    style={{width: 240}}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme={"dark"}
                    items={items}
                />
            </div>
            <div className="p-6 w-full">
                {children}
            </div>
        </div>

    );
}


export default ControlPanelLayout;