"use client"
import React from 'react';
import HeaderBlock from "../../components/Header/Header";
import MaintenanceMode from "@/components/MaintenanceModeComponent/MaintenanceModeComponent";

interface LayoutProps {
    children: React.ReactNode;
}

const isMaintenanceMode = false;

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            {isMaintenanceMode ? <MaintenanceMode /> : <div>
                <HeaderBlock/>
                {children}
            </div>}
        </div>
    );
};

export default Layout;