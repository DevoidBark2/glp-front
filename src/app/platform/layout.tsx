"use client";
import React, { useEffect, useState } from 'react';
import HeaderBlock from "../../components/Header/Header";
import MaintenanceMode from "@/components/MaintenanceModeComponent/MaintenanceModeComponent";
import { observer } from 'mobx-react';
import { useMobxStores } from '@/stores/stores';
import { Spin } from 'antd'; // Используйте ваш компонент загрузки, если у вас другой

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { generalSettingsStore } = useMobxStores();
    const [serviceMode, setServiceMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        generalSettingsStore.getGeneralSettings().then(response => {
            setServiceMode(response.data[0].service_mode);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {serviceMode ? <MaintenanceMode /> : <div>
                <HeaderBlock />
                {children}
            </div>}
        </div>
    );
};

export default observer(Layout);
