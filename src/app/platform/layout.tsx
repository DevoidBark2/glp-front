"use client";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { usePathname } from 'next/navigation';
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets";
import { useMobxStores } from "@/shared/store/RootStore";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { userProfileStore, generalSettingsStore } = useMobxStores()
    const pathName = usePathname();

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => userProfileStore.setLoading(false));

        if (!pathName.includes('/lessons/')) {
            generalSettingsStore.getFooter();
        }
    }, []);


    // if (generalStore.loading) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <Spin size="large" />
    //         </div>
    //     );
    // }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* {generalStore.generalSettings?.service_mode ? (
                <MaintenanceModeComponent serviceModeText={generalStore.generalSettings?.service_mode_text} />
            ) : (
                <>
                    {!pathName.includes('/lessons/') && <Header />}
                    <div style={{ flex: 1 }}>{children}</div>
                    {!pathName.includes('/lessons/') &&  <Footer />}
                </>
            )} */}
            <>
                {!pathName.includes('/lessons/') && <Header />}
                <div style={{ flex: 1 }}>{children}</div>
                {!pathName.includes('/lessons/') && <Footer />}
            </>
        </div>
    );
};

export default observer(Layout);
