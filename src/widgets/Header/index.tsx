"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Avatar, Button, Dropdown, MenuProps, Spin} from "antd";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {platformMenu} from "@/shared/constants";
import {UserRole} from "@/shared/api/user/model";
import {UserOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import {useMobxStores} from "@/shared/store/RootStore";
import {AuthMethodEnum} from "@/shared/api/auth/model";
import nextConfig from "../../../next.config.mjs";

export type UserType = {
    role: UserRole,
    first_name: string,
    second_name: string,
    last_name: string
};

export const Header = observer(() => {
    const { userStore, userProfileStore } = useMobxStores();
    const pathName = usePathname();
    const router = useRouter();

    const [items, setItems] = useState<MenuProps["items"]>([]);

    useEffect(() => {
        if (!userProfileStore.loading) {
            const menuItems: MenuProps["items"] = [
                {
                    key: "1",
                    label: (
                        <div className="flex items-center">
                            <Image
                                src="/static/profile_icon.svg"
                                alt="Профиль"
                                width={20}
                                height={20}
                            />
                            <Link
                                href={"/platform/profile"}
                                className="ml-2 text-black hover:text-black"
                            >
                                Мой профиль
                            </Link>
                        </div>
                    ),
                },
                userProfileStore.userProfile &&
                    (userProfileStore.userProfile.role === UserRole.TEACHER ||
                        userProfileStore.userProfile.role === UserRole.SUPER_ADMIN ||
                        userProfileStore.userProfile.role === UserRole.MODERATOR)
                    ? {
                        key: "2",
                        label: (
                            <div
                                className="flex items-center"
                                onClick={() => router.push("/control-panel")}
                            >
                                <Image
                                    src="/static/control_panel_icon.svg"
                                    alt="Панель учителя"
                                    width={20}
                                    height={20}
                                />
                                <span className="ml-2 text-black hover:text-black">
                                    Панель учителя
                                </span>
                            </div>
                        ),
                    }
                    : null,
                {
                    key: "3",
                    label: (
                        <div className="flex items-center">
                            <Image
                                src="/static/settings_icon.svg"
                                alt="Настройки"
                                width={20}
                                height={20}
                            />
                            <Link
                                href={"/platform/settings"}
                                className="ml-2 text-black hover:text-black"
                            >
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
                                userStore.logout().then(() => {
                                    userProfileStore.setUserProfile(null);
                                    setItems([]);
                                    router.push("/platform");
                                });
                            }}
                        >
                            <Image
                                src="/static/logout_icon.svg"
                                alt="Выйти из аккаунта"
                                width={20}
                                height={20}
                            />
                            <p className="ml-2 text-black hover:text-black">Выйти</p>
                        </div>
                    ),
                },
            ].filter((item) => item !== null);
            setItems(menuItems);
        }
    }, [userProfileStore.loading, userProfileStore.userProfile]);

    return (
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
                        <div className="flex items-center justify-center">
                            <Spin size="large" />
                        </div>
                    ) : userProfileStore.userProfile ? (
                        <Dropdown menu={{ items }} placement="bottomRight">
                            <div className="flex items-center cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-white/20">
                                <Avatar
                                    size={40}
                                    src={
                                        userProfileStore.userProfile?.image
                                            ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
                                            userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
                                                ? userProfileStore.userProfile?.image
                                                : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
                                            : undefined
                                    }
                                    icon={!userProfileStore.userProfile?.image && <UserOutlined />}
                                />

                            </div>
                        </Dropdown>
                    ) : (
                        <Button
                            type="default"
                            onClick={() => router.push('/platform/auth/login')}
                            className="bg-white text-green-500 hover:bg-green-600 hover:text-white transition-transform duration-300 transform hover:scale-105"
                        >
                            Войти в профиль
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});