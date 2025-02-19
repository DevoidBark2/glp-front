"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Button, MenuProps, Spin, Drawer, Dropdown } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PlatformMenu } from "@/shared/constants";
import { UserRole } from "@/shared/api/user/model";
import { UserOutlined, HomeOutlined, ReadOutlined } from "@ant-design/icons";
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
        { key: 2, title: "Курсы", link: '/platform/courses', icon: <HomeOutlined /> },
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
        if (userProfileStore.loading) return;

        const menuItems = [
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

                {/*<div className="lg:hidden">*/}
                {/*    <MenuOutlined*/}
                {/*        className="text-white text-2xl cursor-pointer hover:text-[#00bfff] transition-colors duration-200"*/}
                {/*        onClick={() => setDrawerOpen(true)} // Открытие меню*/}
                {/*    />*/}
                {/*</div>*/}

                <Link href="/platform">
                    <span className="text-4xl font-bold text-black dark:text-white">
                        Learnify
                    </span>
                </Link>

                <div className="flex w-1/5 justify-between items-center space-x-4">
                    {platformMenu.map((menuItem) => (
                        <Link
                            key={menuItem.key}
                            href={menuItem.link}
                            className={`text-black text-lg font-medium relative group hover:text-gray-700 transition-all duration-300
            ${pathName === menuItem.link ? "text-gray-900" : ""}`}
                        >
                            {menuItem.title}
                            <span
                                className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-all duration-300 
                ${pathName === menuItem.link ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            ></span>
                        </Link>
                    ))}

                </div>

                <div className="hidden lg:flex items-center space-x-4">
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

            </div>
        </div>

    );
});


{/* Мобильное меню (Drawer) */
}
// <Drawer
//     title={<span className="text-lg font-semibold text-gray-800">Меню</span>}
//     placement="right"
//     onClose={() => setDrawerOpen(false)} // Закрытие меню
//     open={isDrawerOpen}
//     closeIcon={<CloseOutlined className="text-gray-600" />}
//     style={{ padding: 0 }}
// >
//     <div className="flex flex-col p-4">
//         <div className="flex flex-col space-y-3">
//             {platformMenu.map((menuItem) => (
//                 <Link
//                     key={menuItem.key}
//                     href={menuItem.link}
//                     className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${pathName === menuItem.link
//                         ? "bg-blue-100 text-blue-600 font-semibold"
//                         : "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
//                     }`}
//                     onClick={() => setDrawerOpen(false)} // Закрытие меню после клика
//                 >
//                     {menuItem.icon}
//                     <span>{menuItem.title}</span>
//                 </Link>
//             ))}
//         </div>
//
//         <div className="border-t my-4"></div>
//
//         {userProfileStore.loading ? (
//             <div className="flex justify-center py-4">
//                 <Spin size="large" />
//             </div>
//         ) : userProfileStore.userProfile ? (
//             <div className="flex flex-col space-y-3">
//                 <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 shadow-sm">
//                     <Avatar
//                         size={48}
//                         src={
//                             userProfileStore.userProfile?.image
//                                 ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
//                                 userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
//                                     ? userProfileStore.userProfile?.image
//                                     : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
//                                 : undefined
//                         }
//                         icon={!userProfileStore.userProfile?.image && <UserOutlined />}
//                     />
//                     <div>
//                         <p className="text-gray-900 font-semibold">
//                             {userProfileStore.userProfile?.first_name || "Профиль"}
//                         </p>
//                         <p className="text-gray-600 text-sm">{userProfileStore.userProfile?.role}</p>
//                     </div>
//                 </div>
//                 <div className="flex flex-col space-y-3">
//                     {items!.map((item) => (
//                         <div
//                             key={item?.key}
//                             className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
//                             onClick={() => setDrawerOpen(false)} // Для выхода из аккаунта
//                         >
//                             {item?.label}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         ) : (
//             <Button
//                 type="default"
//                 onClick={() => {
//                     router.push("/platform/auth/login");
//                     setDrawerOpen(false);
//                 }}
//                 className="bg-blue-500 text-white hover:bg-blue-600 w-full rounded-lg p-3 shadow-md"
//             >
//                 Войти
//             </Button>
//         )}
//     </div>
// </Drawer>