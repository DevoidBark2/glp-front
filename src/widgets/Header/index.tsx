"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Dropdown, MenuProps, Spin, Drawer } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PlatformMenu } from "@/shared/constants";
import { UserRole } from "@/shared/api/user/model";
import { UserOutlined, MenuOutlined, CloseOutlined, HomeOutlined, ReadOutlined, RadiusSettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import nextConfig from "../../../next.config.mjs";

export const Header = observer(() => {
    const { userStore, userProfileStore } = useMobxStores();
    const pathName = usePathname();
    const router = useRouter();

    const [items, setItems] = useState<MenuProps["items"]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false); // Для управления бургер-меню

    const platformMenu: PlatformMenu[] = [
        { key: 1, title: "Главная", link: '/platform', icon: <HomeOutlined /> },
        { key: 2, title: "Рейтинг", link: '/platform/rating', icon: <RadiusSettingOutlined /> },
        { key: 3, title: "Блог", link: '/platform/blog', icon: <ReadOutlined /> },
    ]

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
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/platform"><span className="text-white text-2xl font-bold">Learnify</span></Link>
                </div>

                {/* Десктопное меню */}
                <div className="hidden lg:flex items-center space-x-8">
                    {platformMenu.map((menuItem) => (
                        <Link
                            key={menuItem.key}
                            href={menuItem.link}
                            className={`text-white text-lg hover:text-yellow-300 transition-transform transform hover:scale-105 ${pathName === menuItem.link ? "border-b-2 border-yellow-300" : ""
                                }`}
                        >
                            {menuItem.title}
                        </Link>
                    ))}
                </div>

                {/* Аватар пользователя или кнопка входа */}
                <div className="hidden lg:flex items-center space-x-4">
                    {userProfileStore.loading ? (
                        <div className="flex items-center justify-center p-3">
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
                        <div className="p-3">
                            <Button
                                type="primary"
                                color="white"
                                onClick={() => router.push('/platform/auth/login')}
                                className="text-white"
                            >
                                Войти
                            </Button>
                            <Button
                                type="primary"
                                color="white"
                                onClick={() => router.push('/platform/auth/register')}
                                className="text-white ml-3"
                            >
                                Регистрация
                            </Button>
                        </div>
                    )}
                </div>


                {/* Бургер-меню для мобильных */}
                <div className="lg:hidden">
                    <MenuOutlined
                        className="text-white text-2xl cursor-pointer"
                        onClick={() => setDrawerOpen(true)}
                    />
                </div>
            </div>

            {/* Мобильное меню */}
            <Drawer
                title={<span className="text-lg font-semibold text-gray-800">Меню</span>}
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={isDrawerOpen}
                closeIcon={<CloseOutlined className="text-gray-600" />}
                style={{ padding: 0 }}
            >
                <div className="flex flex-col p-4">
                    {/* Список ссылок */}
                    <div className="flex flex-col space-y-3">
                        {platformMenu.map((menuItem) => (
                            <Link
                                key={menuItem.key}
                                href={menuItem.link}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${pathName === menuItem.link
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                                onClick={() => setDrawerOpen(false)} // Закрытие меню после клика
                            >
                                {menuItem.icon} {/* Иконка пункта меню */}
                                <span>{menuItem.title}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Разделитель */}
                    <div className="border-t my-4"></div>

                    {/* Меню пользователя */}
                    {userProfileStore.loading ? (
                        <div className="flex justify-center py-4">
                            <Spin size="large" />
                        </div>
                    ) : userProfileStore.userProfile ? (
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 shadow-sm">
                                <Avatar
                                    size={48}
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
                                <div>
                                    <p className="text-gray-900 font-semibold">
                                        {userProfileStore.userProfile?.first_name || "Профиль"}
                                    </p>
                                    <p className="text-gray-600 text-sm">{userProfileStore.userProfile?.role}</p>
                                </div>
                            </div>
                            {/* Опции пользователя */}
                            <div className="flex flex-col space-y-3">
                                {items!.map((item) => (
                                    <div
                                        key={item?.key}
                                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                                        onClick={() => setDrawerOpen(false)} // Для выхода из аккаунта
                                    >
                                        {item?.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="default"
                            onClick={() => {
                                router.push("/platform/auth/login");
                                setDrawerOpen(false);
                            }}
                            className="bg-blue-500 text-white hover:bg-blue-600 w-full rounded-lg p-3 shadow-md"
                        >
                            Войти
                        </Button>
                    )}
                </div>
            </Drawer>


        </div>
    );
});
