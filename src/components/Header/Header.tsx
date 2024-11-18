"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Modal, Spin, Button, Dropdown, MenuProps } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import { getCookieUserDetails } from "@/lib/users";
import LoginComponent from "@/components/LoginComponent/LoginComponent";
import RegisterComponent from "@/components/RegisterComponent/RegisterComponent";
import ForgotPasswordComponent from "@/components/ForgotPasswordComponent/ForgotPasswordComponent";
import { platformMenu } from "@/constants";
import { UserRole } from "@/shared/api/user/model";

export type UserType = {
    user: { user_name: string; role: UserRole };
};

const HeaderBlock = () => {
    const { userStore, userProfileStore } = useMobxStores();
    const pathName = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    const [items, setItems] = useState<MenuProps["items"]>([]);

    const configureMenuItems = (role: UserRole) => {
        const menuItems: MenuProps["items"] = [
            {
                key: "1",
                label: (
                    <div className="flex items-center">
                        <Image src="/static/profile_icon.svg" alt="Профиль" width={20} height={20} />
                        <Link href={"/platform/profile"} className="ml-2 text-black hover:text-black">
                            Мой профиль
                        </Link>
                    </div>
                ),
            },
            (role === UserRole.TEACHER || role === UserRole.SUPER_ADMIN || role === UserRole.MODERATOR) ? {
                key: "2",
                label: (
                    <div className="flex items-center" onClick={() => router.push("/control-panel")}>
                        <Image src="/static/control_panel_icon.svg" alt="Панель учителя" width={20} height={20} />
                        <span className="ml-2 text-black hover:text-black">Панель учителя</span>
                    </div>
                ),
            } : null,
            {
                key: "3",
                label: (
                    <div className="flex items-center">
                        <Image src="/static/settings_icon.svg" alt="Настройки" width={20} height={20} />
                        <Link href={"/platform/settings"} className="ml-2 text-black hover:text-black">
                            Настройки
                        </Link>
                    </div>
                ),
            },
            {
                key: "4",
                label: (
                    <div
                        className="flex items-center"
                        onClick={() => {
                            userStore.logout();
                            setCurrentUser(null);
                            setItems([]);
                            router.push('/platform')
                        }}
                    >
                        <Image src="/static/logout_icon.svg" alt="Выйти из аккаунта" width={20} height={20} />
                        <p className="ml-2 text-black hover:text-black">Выйти</p>
                    </div>
                ),
            },
        ].filter(Boolean);
        setItems(menuItems);
    };

    useEffect(() => {
        const user = getCookieUserDetails();
        setCurrentUser(user);

        if (user) {
            configureMenuItems(user.user.role);
        }
    }, [userStore.openLoginModal]);

    return (
        <>
            <LoginComponent />

            <Modal
                open={userStore.openRegisterModal}
                title="Регистрация"
                onCancel={() => userStore.setOpenRegisterModal(false)}
                footer={null}
            >
                <RegisterComponent />
            </Modal>

            <Modal
                open={userStore.openForgotPasswordModal}
                title="Восстановление пароля"
                onCancel={() => userStore.setOpenForgotPasswordModal(false)}
                footer={null}
            >
                <ForgotPasswordComponent />
            </Modal>

            <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 p-6 shadow-lg">
                <div className="flex justify-between container mx-auto items-center">
                    <div className="flex items-center">
                        <span className="text-white text-2xl font-bold ml-2">Learnify</span>
                        <div className="flex ml-10 space-x-5">
                            {platformMenu.map((menuItem) => (
                                <Link
                                    key={menuItem.key}
                                    href={menuItem.link}
                                    className={`text-white text-lg hover:text-yellow-300 transition-transform transform hover:scale-105 ${pathName === menuItem.link ? "border-b-2 border-yellow-300" : ""}`}
                                >
                                    {menuItem.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {userProfileStore.loading ? (
                            <Spin size="large" />
                        ) : currentUser ? (
                            <Dropdown menu={{ items }} placement="bottomLeft">
                                <div className="flex items-center cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-white/20">
                                    <Avatar
                                        size={40}
                                        src={userProfileStore.userAvatar || undefined}
                                        icon={!userProfileStore.userAvatar}
                                    />
                                    <div className="text-white font-semibold ml-3">
                                        {`${userProfileStore.userProfile?.second_name ?? ""} ${userProfileStore.userProfile?.first_name ?? ""} ${userProfileStore.userProfile?.last_name ?? ""}`}
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <Button
                                type="default"
                                onClick={() => userStore.setOpenLoginModal(true)}
                                className="bg-white text-green-500 hover:bg-green-600 hover:text-white transition-transform duration-300 transform hover:scale-105"
                            >
                                Войти в профиль
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default observer(HeaderBlock);
