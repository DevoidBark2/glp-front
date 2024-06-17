import React from "react";
import {Menu, MenuProps} from "antd";
import {AppstoreOutlined, MailOutlined, SettingOutlined} from "@ant-design/icons";
import Link from "next/link";

interface LayoutProps {
    children: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'sub1',
        label: <Link href="/control_panel">Главная</Link>,
        icon: <MailOutlined />,
    },
    {
        key: 'sub23',
        label: <Link href="/control_panel/posts">Посты</Link>,
        icon: <MailOutlined />,
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