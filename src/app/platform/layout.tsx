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
        <div className='cursor-container relative overflow-hidden' style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {!pathName.includes('/lessons/') && <Header/>}
            {children}
            {!pathName.includes('/lessons/') && <Footer/>}
        </div>
    );
};

export default observer(Layout);
