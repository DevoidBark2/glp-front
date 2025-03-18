"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { usePathname } from "next/navigation";
import { Button, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets";
import { useMobxStores } from "@/shared/store/RootStore";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { userProfileStore, generalSettingsStore } = useMobxStores();
    const pathName = usePathname();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [achievementData] = useState<{ title: string; message: string }>({ title: '', message: '' });

    useEffect(() => {
        if(!pathName.includes('profile')){
            userProfileStore.getUserProfile().finally(() => userProfileStore.setLoading(false));
        }

        if (!pathName.includes("/lessons/")) {
            generalSettingsStore.getFooter();
        }
    }, [pathName, userProfileStore, generalSettingsStore]);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <div className="flex flex-col min-h-screen dark:bg-[#1a1a1a]">
                {!pathName.includes("/lessons/") && <Header />}

                <main className="flex-grow">{children}</main>

                {!pathName.includes("/lessons/") && <Footer />}

                <Modal
                    title={<span className="text-green-500 text-xl font-semibold">Поздравляем!</span>}
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="ok" type="primary" onClick={handleOk}>
                            Понятно
                        </Button>,
                    ]}
                    centered
                    className="achievement-modal"
                    width={400}
                >
                    <div className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 text-4xl mr-4" />
                        <div>
                            <p className="text-lg font-medium">{achievementData.title}</p>
                            <p>{achievementData.message}</p>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default observer(Layout);
