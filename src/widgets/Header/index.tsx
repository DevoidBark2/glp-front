"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Button, MenuProps, Spin, Drawer, Dropdown } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserOutlined, HomeOutlined, ReadOutlined, CloseOutlined, MenuOutlined, BookOutlined, DownOutlined, UpOutlined, BarChartOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";

import { PlatformMenu } from "@/shared/constants";
import { UserRole } from "@/shared/api/user/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";

import nextConfig from "../../../next.config.mjs";


export const Header = observer(() => {
    const { userStore, userProfileStore } = useMobxStores();
    const pathName = usePathname();
    const router = useRouter();
    const { resolvedTheme } = useTheme()

    const [items, setItems] = useState<MenuProps["items"]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const platformMenu: PlatformMenu[] = [
        { key: 1, title: "Главная", link: '/platform', icon: <HomeOutlined /> },
        // { key: 2, title: "Курсы", link: '/platform/courses', icon: <BookOutlined /> },
        { key: 2, title: "Лидерборд", link: '/platform/leaders', icon: <BarChartOutlined /> },
        { key: 3, title: "Блог", link: '/platform/blog', icon: <ReadOutlined /> },
    ]


    const handleLogoutUser = () => {
        userStore.logout().then(() => {
            userProfileStore.setUserProfile(null);
            setItems([]);
            router.push("/platform");
        });
    }

    const createMenuItem = (href: string, text: string, iconSrc: string) => (
        <Link href={href}>
            <div className="flex items-center group">
                <Image src={iconSrc} alt={text} width={20} height={20} />
                <p className="ml-2 text-gray-800 group-hover:text-gray-900 transition-all duration-200">{text}</p>
            </div>
        </Link>
    );

    useEffect(() => {
        if (userProfileStore.loading) {return;}

        const menuItems: MenuProps["items"] = [
            {
                key: "1",
                label: createMenuItem("/platform/profile", "Профиль", "/static/profile_icon.svg"),
            },
            ...(userProfileStore.userProfile?.role === UserRole.TEACHER ||
                userProfileStore.userProfile?.role === UserRole.SUPER_ADMIN ||
                userProfileStore.userProfile?.role === UserRole.MODERATOR
                ? [
                    {
                        key: "2",
                        label: createMenuItem("/control-panel", "Панель учителя", "/static/control_panel_icon.svg"),
                    },
                ]
                : []),
            {
                key: "3",
                label: createMenuItem("/platform/settings", "Настройки", "/static/settings_icon_2.svg"),
            },
            {
                key: "4",
                label: (
                    <div className="flex items-center group" onClick={handleLogoutUser}>
                        <Image src="/static/logout_icon.svg" alt="Выйти" width={20} height={20} />
                        <p className="ml-2 text-gray-800 group-hover:text-gray-900 transition-all duration-200">Выйти</p>
                    </div>
                ),
            },
        ];

        setItems(menuItems);
    }, [userProfileStore.loading, userProfileStore.userProfile]);

    return (
        <div className="dark:bg-[#1a1a1a] p-6 relative overflow-hidden">
            <div className="container mx-auto flex justify-between items-center relative z-10 border-b pb-6">

                <Link href="/platform">
                    <span className="text-4xl font-bold text-black dark:text-white">
                        Learnify
                    </span>
                </Link>

                <div className="w-1/5 justify-between items-center space-x-6 hidden xl:flex">
                    {platformMenu.map((menuItem) => (
                        <Link
                            key={menuItem.key}
                            href={menuItem.link}
                            className={`text-black text-lg dark:text-white font-medium relative group transition-all duration-300 
        ${pathName === menuItem.link ? "text-gray-900 dark:text-white" : "hover:text-gray-700 dark:hover:text-gray-300"}`}
                        >
                            {menuItem.title}
                            <span
                                className={`absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300 
            ${pathName === menuItem.link
                                        ? "bg-black dark:bg-white opacity-100"  // Активный пункт: чёрный в светлой, белый в тёмной теме
                                        : "opacity-0 group-hover:opacity-100 bg-black dark:bg-white"}`} // Наведение: подчёркивание белым в тёмной
                            ></span>
                        </Link>
                    ))}
                </div>

                <div className="hidden xl:flex items-center space-x-4">
                    {userProfileStore.userProfile ? (
                        <Dropdown menu={{ items }} placement="bottomRight">
                            <Avatar
                                className="flex items-center cursor-pointer p-2 rounded"
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
                        </Dropdown>
                    ) : (
                        <div className="flex space-x-4">
                            <Button
                                className="text-white text-lg px-6 uppercase font-bold cursor-pointer border-none rounded-md"
                                // variant="solid"
                                color="default"
                                variant="outlined"
                                onClick={() => router.push("/platform/auth/login")}
                            >
                                Войти
                            </Button>
                            <Button
                                className="text-white text-lg px-6 uppercase font-bold cursor-pointer border-none rounded-md"
                                color="default"
                                variant="solid"
                                onClick={() => router.push("/platform/auth/register")}
                            >
                                Регистрация
                            </Button>
                        </div>
                    )}
                </div>


                <div className="xl:hidden">
                    <MenuOutlined
                        className="text-2xl dark:text-white cursor-pointer hover:text-[#2c2c2c] transition-colors duration-200"
                        onClick={() => setDrawerOpen(true)}
                    />
                </div>

                <Drawer
                    title={<span className="text-lg font-semibold dark:text-white">Меню</span>}
                    placement="right"
                    onClose={() => setDrawerOpen(false)}
                    open={isDrawerOpen}
                    closeIcon={<CloseOutlined className="text-gray-600 dark:text-gray-400" />}
                    style={{ padding: 0, backgroundColor: resolvedTheme === "dark" ? "#1a1a1a" : "white" }}
                >
                    <div className="flex flex-col p-4">
                        <div className="flex flex-col space-y-3">
                            {platformMenu.map((menuItem) => (
                                <Link
                                    key={menuItem.key}
                                    href={menuItem.link}
                                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 
                        ${pathName === menuItem.link
                                            ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                                            : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    {menuItem.icon}
                                    <span>{menuItem.title}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

                        {userProfileStore.loading ? (
                            <div className="flex justify-center py-4">
                                <Spin size="large" />
                            </div>
                        ) : userProfileStore.userProfile ? (
                            <div className="flex flex-col space-y-3">
                                <Dropdown
                                    menu={{ items: items, onClick: () => setDrawerOpen(false) }}
                                    trigger={["click"]}
                                    open={menuOpen}
                                    onOpenChange={setMenuOpen}
                                >
                                    <div
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
                                        onClick={handleMenuClick}
                                    >
                                        <div className="flex items-center gap-4">
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
                                                <p className="text-gray-900 dark:text-white font-semibold">
                                                    {userProfileStore.userProfile?.first_name || "Профиль"}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {userProfileStore.userProfile?.role}
                                                </p>
                                            </div>
                                        </div>

                                        {menuOpen ?
                                            <UpOutlined style={{ color: resolvedTheme === "dark" ? "white" : "black" }} /> :
                                            <DownOutlined style={{ color: resolvedTheme === "dark" ? "white" : "black" }} />}
                                    </div>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="flex justify-between gap-5">
                                <Button
                                    className="text-white w-full text-lg px-6 uppercase font-bold cursor-pointer border-none rounded-md"
                                    // variant="solid"
                                    color="default"
                                    variant="outlined"
                                    onClick={() => {
                                        setDrawerOpen(false)
                                        router.push("/platform/auth/login")
                                    }}
                                >
                                    Войти
                                </Button>
                                <Button
                                    className="text-white w-full text-lg px-6 uppercase font-bold cursor-pointer border-none rounded-md"
                                    color="default"
                                    variant="solid"
                                    onClick={() => {
                                        setDrawerOpen(false)
                                        router.push("/platform/auth/register")
                                    }}
                                >
                                    Регистрация
                                </Button>
                            </div>
                        )}
                    </div>
                </Drawer>

            </div>
        </div>
    );
});