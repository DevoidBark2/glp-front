"use client"
import React, { useState } from "react";
import { Button, Form, Modal, notification, Tabs, TabsProps } from "antd";
import { observer } from "mobx-react";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

import { ChangePasswordType } from "@/shared/api/auth/model";
import { ResetPassword } from "@/entities/user-settings/ui/ResetPassword";
import { ManageProfile } from "@/entities/user-settings/ui/ManageProfile";
import { useMobxStores } from "@/shared/store/RootStore";
import { PlatformSettings } from "@/entities/user-settings/ui/PlatformSettings";


const SettingsPage = observer(() => {
    const { authStore, userProfileStore } = useMobxStores()
    const [form] = Form.useForm<ChangePasswordType>();
    const router = useRouter();
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
    const changeTabsPosition = useMediaQuery({ query: "(max-width: 1100px)" });

    const handleChangePassword = (values: ChangePasswordType) => {
        authStore.changePassword(values).then((response) => {
            notification.success({ message: response.message })
            form.resetFields();
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    };

    const handleShowModal = () => {
        setShowDeleteAccountModal(true)
    }

    const handleDeleteAccount = () => {
        authStore.deleteAccount().then(() => {
            userProfileStore.setUserProfile(null);
            setShowDeleteAccountModal(false)
            router.push("/platform");
        })
    }

    const items: TabsProps['items'] = [
        {
            key: "1",
            label: <span className="dark:text-white">Безопасность</span>,
            children: (<ResetPassword handleChangePassword={handleChangePassword} />),
        },
        {
            key: "2",
            label: <span className="dark:text-white">Управление аккаунтом</span>,
            children: (<ManageProfile showDeleteAccountModal={handleShowModal} />),
        },
        {
            key: "3",
            label: <span className="dark:text-white">Платформа</span>,
            children: (<PlatformSettings />),
        },
    ];

    return (
        <>
            {showDeleteAccountModal && (
                <Modal
                    title="Удаление аккаунта"
                    open={showDeleteAccountModal}
                    onCancel={() => setShowDeleteAccountModal(false)}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => setShowDeleteAccountModal(false)}
                            className="bg-gray-800 text-white border border-neon-blue hover:bg-gray-700 transition-all shadow-md"
                        >
                            Отменить
                        </Button>,
                        <Button
                            key="delete"
                            danger
                            type="primary"
                            onClick={handleDeleteAccount}
                            className="bg-cyber-red text-black border border-cyber-red hover:bg-red-500 transition-all shadow-md"
                        >
                            Удалить
                        </Button>,
                    ]}
                    centered
                    width={400}
                >
                    <p>
                        Вы действительно хотите стереть себя из системы?
                    </p>
                </Modal>
            )}


            <div className="container mx-auto mt-10 px-6">
                <Tabs
                    tabPosition={changeTabsPosition ? "top" : "left"}
                    animated={!changeTabsPosition} items={items} />
            </div>
        </>

    )
})

export default SettingsPage;