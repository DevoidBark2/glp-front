"use client"
import React from 'react';
import HeaderBlock from "../../components/Header/Header";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <HeaderBlock/>
            {children}
        </div>
    );
};

export default Layout;