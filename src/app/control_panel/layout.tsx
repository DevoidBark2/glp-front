import React from "react";
import {Menu, MenuProps} from "antd";
import {AppstoreOutlined, TeamOutlined, BarsOutlined,LogoutOutlined} from "@ant-design/icons";
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
    }
];
const ControlPanelLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex p-10 bg-[rgba(89,186,145,0.9)] h-screen">
            <Menu
                style={{ width: 256 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
            <div className="px-10 w-full">
                {children}
            </div>
        </div>
    );
}


export default ControlPanelLayout;