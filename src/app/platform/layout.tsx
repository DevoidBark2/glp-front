"use client";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {usePathname} from 'next/navigation';
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets";
import { useMobxStores } from "@/shared/store/RootStore";

interface LayoutProps {
    children: React.ReactNode;
}

const CyberpunkBackground = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="cyber-grid"></div>
            <div className="cyber-blur"></div>
        </div>
    );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { userProfileStore, generalSettingsStore } = useMobxStores();
    const pathName = usePathname();

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => userProfileStore.setLoading(false));

        if (!pathName.includes('/lessons/')) {
            generalSettingsStore.getFooter();
        }
    }, [pathName, userProfileStore, generalSettingsStore]);

    return (
        <div className='cursor-container relative overflow-hidden'
             style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {/* Cyberpunk Background */}
            {!pathName.includes('/ui-test') && <CyberpunkBackground/>}

            {/* Header */}
            {!pathName.includes('/lessons/') && !pathName.includes('/3d') && !pathName.includes('/ui-test') &&
                <Header/>}

            {children}

            {/* Footer */}
            {!pathName.includes('/lessons/') && !pathName.includes('/3d') && !pathName.includes('/ui-test') &&
                <Footer/>}
        </div>
    );
};

export default observer(Layout);
