"use client"
import React from "react";
import {Divider, Menu, MenuProps} from "antd";
import {
    AppstoreOutlined,
    TeamOutlined,
    BarsOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image"

interface LayoutProps {
    children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'home',
        label: <Link href={"/control_panel"}>Главная</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'courses',
        label: <Link href={"/control_panel/courses"}>Курсы</Link>,
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
        ]
    },
    {
        key: 'tasks',
        label: <Link href={"/control_panel/tasks"}>Задания</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'posts',
        label: <Link href={"/control_panel/posts"}>Посты</Link>,
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
        icon: <TeamOutlined />,
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
    return (
        <div className="flex bg-gradient-to-r from-green-400 via-green-500 to-green-600">
            <div className="flex flex-col bg-gray-800 h-screen p-6 shadow-lg">
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="relative mb-4">
                        <Image
                            src="/static/logout_icon.svg"
                            alt="Выйти"
                            width={40}
                            height={40}
                            className="absolute right-0 cursor-pointer transform transition-transform hover:scale-110"
                        />
                        <div
                            className="rounded-full bg-gray-700 h-16 w-16 flex items-center justify-center overflow-hidden">
                            <img src="/static/user_avatar.png" alt="User Avatar"
                                 className="h-full w-full object-cover"/>
                        </div>
                    </div>
                    <h1 className="text-white text-lg font-semibold">Петров Иван Михайлович</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <Image
                            src="/static/light_theme_icon.svg"
                            alt="Светлая тема"
                            width={30}
                            height={30}
                            className="cursor-pointer transform transition-transform hover:scale-110"
                        />
                        <Image
                            src="/static/notification_icon.svg"
                            alt="Уведомление"
                            width={30}
                            height={30}
                            className="cursor-pointer transform transition-transform hover:scale-110"
                        />
                        <Image
                            src="/static/settings_panel_icon.svg"
                            alt="Настройки"
                            width={30}
                            height={30}
                            className="cursor-pointer transform transition-transform hover:scale-110"
                        />
                        <Image
                            src="/static/profile_panel_icon.svg"
                            alt="Профиль"
                            width={30}
                            height={30}
                            className="cursor-pointer transform transition-transform hover:scale-110"
                        />
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