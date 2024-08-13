"use client"
import React, {useState} from "react";
import {Button, Divider, Menu, MenuProps} from "antd";
import {
    AppstoreOutlined,
    TeamOutlined,
    BarsOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image"

interface LayoutProps {
    children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'sub1',
        label: <Link href="/control_panel">Главная</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'sub23213',
        label: <Link href="/control_panel/courses">Курсы</Link>,
        icon: <BarsOutlined />,
        children: [
            {
                key: 'sub2321d3',
                label: <Link href="/control_panel/courses">Ваши курсы</Link>,
                icon: <BarsOutlined />,
            },
            {
                key: 'sub232qq1d3',
                label: <Link href="/control_panel/sections">Разделы</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'sub2111113',
        label: <Link href="/control_panel/tasks">Задания</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'sub23',
        label: <Link href="/control_panel/posts">Посты</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'sub324',
        label: <Link href="/control_panel/students">Студенты</Link>,
        icon: <TeamOutlined />,
    },
    {
        key: 'sub3asdasd24',
        label: <Link href="/control_panel/settings">Настройки</Link>,
        icon: <TeamOutlined />,
    },
    {
        key: 'sub354',
        label: <Link href="/platform">Вернуться на платформу</Link>,
        icon: <LogoutOutlined />,
    },
    {
        key: 'sub2321asd3',
        label: <p>Справочники</p>,
        icon: <BarsOutlined />,
        children: [
            {
                key: 'sub2321dsadsad3',
                label: <Link href={"/control_panel/category"}>Категории</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'sub2321asфывфывd3',
        label: <p>Логирование</p>,
        icon: <BarsOutlined />,
        children: [
            {
                key: 'sub2321dsadфывыфвsad3',
                label: <Link href={"/control_panel/events"}>События пользователей</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'sub2фывыфв3',
        label: <Link href="/control_panel/users">Пользователи</Link>,
        icon: <BarsOutlined />,
    },
];
const ControlPanelLayout: React.FC<LayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex bg-[rgba(89,186,145,0.9)]">
           <div className="flex flex-col bg-white h-screen relative">
               <div className="flex flex-col items-center justify-center p-5 ">
                   <Image src="/static/logout_icon.svg" alt="Выйти" width={40} height={40}
                          className="absolute right-0"/>
                   <div className="rounded-full bg-red-600 h-16 w-16"></div>
                   <h1>Петров Иван Михайлович</h1>
                   <div className="flex items-center gap-2">
                       <Image src="/static/light_theme_icon.svg" alt="Светлая тема" width={30} height={30}/>
                       <Image src="/static/notification_icon.svg" alt="Уведомление" width={40} height={40}/>
                       <Image src="/static/settings_panel_icon.svg" alt="Настройки" width={30} height={30}/>
                       <Image src="/static/profile_panel_icon.svg" alt="Настройки" width={30} height={30}/>
                   </div>
               </div>
               <Divider/>
               <Menu
                   style={{width: 300}}
                   defaultSelectedKeys={['1']}
                   defaultOpenKeys={['sub1']}
                   mode="inline"
                   inlineCollapsed={collapsed}
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