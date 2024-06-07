"use client"
import React from 'react';
import HeaderBlock from "../../components/Header/Header";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Menu, theme } from 'antd';
import { Layout as AntLayout } from 'antd';
import {MAIN_COLOR} from "@/app/constans";
import {Footer} from "antd/es/layout/layout";

const { Header, Content, Sider } = AntLayout;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
        key,
        label: `nav ${key}`,
    }));

    return (
        <div>
            <HeaderBlock/>
            {children}
        </div>
    );
};

export default Layout;