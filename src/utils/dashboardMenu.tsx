import {MenuProps} from "antd";
import {
    AppstoreOutlined,
    BarsOutlined,
    BookOutlined, LogoutOutlined,
    PartitionOutlined, SettingOutlined,
    SolutionOutlined, TeamOutlined,
    ToolOutlined
} from "@ant-design/icons";
import Link from "next/link";
import React from "react";

export type MenuItem = Required<MenuProps>['items'][number];

export let dashboardMenuItems: MenuItem[] = [
    {
        key: 'moderators_items',
        type: "submenu",
        label: 'Панель модератора',
        icon: <ToolOutlined />,
        children: [
            {
                key: 'manage-courses',
                label: <Link href={"/control_panel/manage-courses"}>Управление курсами</Link>,
                title: "Управление курсами",
                icon: <BookOutlined />,
            },
            {
                key: 'manage-sections',
                label: <Link href={"/control_panel/manage-sections"}>Управление разделами</Link>,
                title: "Управление разделами",
                icon: <PartitionOutlined />,
            },
            {
                key: 'manage-components',
                label: <Link href={"/control_panel/manage-component"}>Управление компонентами</Link>,
                title: "Управление компонентами",
                icon: <SolutionOutlined />
            },
            {
                key: 'manage-posts',
                label: <Link href={"/control_panel/manage-posts"}>Управление постами</Link>,
                title: "Управление компонентами",
                icon: <SolutionOutlined />
            },
        ]
    },
    {
        key: 'control_panel',
        label: <Link href={"/control_panel"}>Главная</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'courses-parent',
        label: 'Курсы',
        icon: <BarsOutlined />,
        children: [
            {
                key: 'courses',
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
        key: 'nomenclature',
        label: 'Справочники',
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
        label: 'Логирование',
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
    {
        key: 'platform',
        label: <Link href={"/platform"}>Вернуться на платформу</Link>,
        icon: <LogoutOutlined />,
    },
];