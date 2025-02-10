"use client"
import React, {useState} from "react";
import { ChangePasswordType } from "@/shared/api/auth/model";
import {Form, Modal, notification, Tabs, TabsProps} from "antd";
import {observer} from "mobx-react";
import {ResetPassword} from "@/entities/user-settings/ui/ResetPassword";
import {ManageProfile} from "@/entities/user-settings/ui/ManageProfile";
import {useRouter} from "next/navigation";
import {useMobxStores} from "@/shared/store/RootStore";
import CyberTextUnderline from "@/shared/ui/Cyberpunk/CyberTextUnderline";
import CyberFrame from "@/shared/ui/Cyberpunk/CyberFrame";

const SettingsPage = observer(() => {
    const {authStore, userProfileStore} = useMobxStores()
    const [form] = Form.useForm<ChangePasswordType>();
    const router = useRouter()
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

    const handleChangePassword = (values:ChangePasswordType) => {
        authStore.changePassword(values).then((response) => {
            notification.success({message: response.message})
            form.resetFields();
        }).catch(e => {
            notification.error({message: e.response.data.message})
        });
    };

    const handleDeleteAccount = () => {
        setShowDeleteAccountModal(true)
        // authStore.deleteAccount().then(() => {
        //     userProfileStore.setUserProfile(null);
        //     router.push("/platform");
        // })
    }

    const items: TabsProps['items'] = [
        {
            key: "1",
            label: "Безопасность",
            children: ( <ResetPassword handleChangePassword={handleChangePassword}/>),
        },
        {
            key: "2",
            label: "Управление аккаунтом",
            children: (<ManageProfile handleDeleteAccount={handleDeleteAccount} />),
        },
    ];

    return(
        <>
            {showDeleteAccountModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-50 animate-fadeIn">
                    <div className="relative w-[400px] p-6 bg-black border-2 border-neon-blue shadow-lg shadow-cyber-blue/50 transition-all duration-500 scale-95 opacity-0 animate-scaleFadeIn">

                        {/* Верхняя панель */}
                        <div className="flex justify-between items-center border-b border-neon-blue pb-3">
                            <h2 className="text-neon-green text-xl font-bold tracking-wide">
                                SYSTEM ALERT
                            </h2>
                            <button
                                onClick={() => {
                                    setShowDeleteAccountModal(false);
                                }}
                                className="text-cyber-red hover:text-red-500 transition-transform hover:scale-110"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Текст */}
                        <p className="mt-4 text-neon-blue text-white text-lg">
                            Вы действительно хотите стереть себя из системы?
                        </p>

                        {/* Кнопки */}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setShowDeleteAccountModal(false)}
                                className="px-4 py-2 bg-gray-800 text-white border border-neon-blue hover:bg-gray-700 transition-all shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Account deleted");
                                    setShowDeleteAccountModal(false);
                                }}
                                className="px-4 py-2 bg-cyber-red text-black border border-cyber-red hover:bg-red-500 transition-all shadow-md"
                            >
                                DELETE
                            </button>
                        </div>

                        {/* Неоновая рамка */}
                        <div className="absolute top-0 left-0 w-full h-full border-2 border-neon-blue opacity-30 animate-pulse"></div>
                    </div>
                </div>
            )}


            <div className="container mx-auto px-48 mt-10">
                <CyberFrame width="full">
                    <CyberTextUnderline underline>
                        <h1>Настройки</h1>
                    </CyberTextUnderline>
                    <Tabs animated items={items}/>
                </CyberFrame>
            </div>
        </>

    )
})

export default SettingsPage;