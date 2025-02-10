"use client";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {usePathname} from 'next/navigation';
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets";
import { useMobxStores } from "@/shared/store/RootStore";
import { AnimatePresence, motion } from "framer-motion";

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
    const transitionVariants = {
        initial: { opacity: 0, scale: 1.2, rotateY: 90 },
        animate: { opacity: 1, scale: 1, rotateY: 0 },
        exit: { opacity: 0, scale: 0.8, rotateY: -90 }
    };

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => userProfileStore.setLoading(false));

        if (!pathName.includes('/lessons/')) {
            generalSettingsStore.getFooter();
        }
    }, [pathName, userProfileStore, generalSettingsStore]);

    return (
        <AnimatePresence mode="wait" >
            <motion.div
                variants={transitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="cyberpunk-transition"
            >
                <div className='cursor-container relative overflow-hidden'
                     style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    {/* Cyberpunk Background */}
                    {!pathName.includes('/ui-test') && <CyberpunkBackground />}

                    {/* Header */}
                    {!pathName.includes('/lessons/') && !pathName.includes('/3d') && !pathName.includes('/ui-test') &&
                        <Header />}

                    {/* Page Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{ flex: 1 }}
                    >
                        {children}
                    </motion.div>

                    {/* Footer */}
                    {!pathName.includes('/lessons/') && !pathName.includes('/3d') && !pathName.includes('/ui-test') &&
                        <Footer />}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default observer(Layout);
