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
import ThemeSwitch from "@/shared/ui/themeSwitch";

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
        { key: 4, title: "Вопросы и ответы", link: '/platform/blog', icon: <ReadOutlined /> },
    ]

    const [clickSound, setClickSound] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        setClickSound(new Audio("/sounds/click.wav")); // Загружаем звук
    }, []);

    const handleClick = () => {
        if (clickSound) {
            clickSound.currentTime = 0; // Перезапуск звука при повторном клике
            clickSound.play();
        }
    };

    const handleLogoutUser = () => {
        userStore.logout().then(() => {
            userProfileStore.setUserProfile(null);
            setItems([]);
            router.push("/platform");
        });
    }

    useEffect(() => {
        if (!userProfileStore.loading) {
            const menuItems: MenuProps["items"] = [
                {
                    key: "1",
                    label: (
                        <Link href={"/platform/profile"}>
                            <div className="flex items-center">
                                <Image
                                    src="/static/profile_icon.svg"
                                    alt="Профиль"
                                    width={20}
                                    height={20}
                                />
                                <p className="ml-2 text-black hover:text-black">Мой профиль</p>
                            </div>
                        </Link>
                    ),
                },
                userProfileStore.userProfile &&
                    (userProfileStore.userProfile.role === UserRole.TEACHER ||
                        userProfileStore.userProfile.role === UserRole.SUPER_ADMIN ||
                        userProfileStore.userProfile.role === UserRole.MODERATOR)
                    ? {
                        key: "2",
                        label: (
                            <Link href="/control-panel">
                                <div className="flex items-center">
                                    <Image
                                        src="/static/control_panel_icon.svg"
                                        alt="Панель учителя"
                                        width={20}
                                        height={20}
                                    />
                                    <p className="ml-2 text-black hover:text-black">Панель учителя</p>
                                </div>
                            </Link>
                        ),
                    }
                    : null,
                {
                    key: "3",
                    label: (
                        <Link href={"/platform/settings"}>
                            <div className="flex items-center">
                                <Image
                                    src="/static/settings_icon.svg"
                                    alt="Настройки"
                                    width={20}
                                    height={20}
                                />
                                <p className="ml-2 text-black hover:text-black">Настройки</p>
                            </div>
                        </Link>
                    ),
                },
                {
                    key: "4",
                    label: (
                        <div className="flex items-center" onClick={handleLogoutUser}>
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
        <div className="dark:bg-[#1a1a1a] p-6 relative overflow-hidden shadow-[0px_0px_10px_#00ffff] dark:shadow-[0px_0px_10px_#00ffff]">
            <div className="absolute inset-0"></div>
            <div className="container mx-auto flex justify-between items-center relative z-10">


                <div className="flex items-center justify-between w-full px-6">
                    <div className="flex w-1/4 justify-between items-center space-x-8">
                        {platformMenu.slice(0, 2).map((menuItem, index) => (
                            <React.Fragment key={menuItem.key}>
                                <Link
                                    href={menuItem.link}
                                    className={`dark:text-[#efefef] text-lg relative group hover:text-neon-green transition-all duration-300
                ${pathName === menuItem.link ? "text-neon-green" : ""}`}
                                    onClick={handleClick}
                                >
                                    {menuItem.title}
                                    {/* Неоновое подчеркивание при наведении */}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
                                </Link>


                                {index === 0 && (
                                    <span className="text-neon-green text-xl mx-2">•</span>
                                )}
                            </React.Fragment>
                        ))}

                    </div>

                    <div className="flex items-center">
                        <Link href="/platform" className="flex items-center space-x-2">
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 neon-text tracking-wide">
                                Learnify
                            </span>
                        </Link>
                    </div>

                    <div className="flex w-1/3 justify-between items-center space-x-8">
                        {platformMenu.slice(2, 4).map((menuItem, index) => (
                            <React.Fragment key={menuItem.key}>
                                <Link
                                    href={menuItem.link}
                                    className={`dark:text-[#efefef] text-lg relative group hover:text-neon-green transition-all duration-300
                ${pathName === menuItem.link ? "text-neon-green" : ""}`}
                                    onClick={handleClick}
                                >
                                    {menuItem.title}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
                                </Link>


                                {index === 0 && (
                                    <span className="text-neon-green text-xl mx-2">•</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <ThemeSwitch />

                    {/* User Profile / Login Buttons */}
                    {/* <div className="hidden lg:flex items-center space-x-4">
                        {userProfileStore.loading ? (
                            <div className="flex items-center justify-center p-3">
                                <Spin size="large" />
                            </div>
                        ) : userProfileStore.userProfile ? (
                            <Dropdown menu={{ items }} placement="bottomRight">
                                <div className="flex items-center cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-[#00FFFF22]">
                                    <Avatar
                                        size={40}
                                        src={userProfileStore.userProfile?.image}
                                        icon={!userProfileStore.userProfile?.image && <UserOutlined />}
                                    />
                                </div>
                            </Dropdown>
                        ) : (
                            <div className="p-3 flex space-x-4">
                                <Button
                                    className="text-white text-lg px-6 py-3 uppercase font-bold cursor-pointer border-none rounded-md 
                    bg-gradient-to-r from-pink-500 to-cyan-400 shadow-[0_0_10px_#00ffff] 
                    transition-all hover:shadow-[0_0_20px_#00ffff,0_0_40px_#ff0099]"
                                    onClick={() => router.push("/platform/auth/login")}
                                >
                                    Войти
                                </Button>
                                <Button
                                    className="text-white text-lg px-6 py-3 uppercase font-bold cursor-pointer border-none rounded-md 
                    bg-gradient-to-r from-pink-500 to-cyan-400 shadow-[0_0_10px_#00ffff] 
                    transition-all hover:shadow-[0_0_20px_#00ffff,0_0_40px_#ff0099]"
                                    onClick={() => router.push("/platform/auth/register")}
                                >
                                    Регистрация
                                </Button>
                            </div>
                        )}
                    </div> */}
                </div>

            </div>
        </div>
    );
});



// {/* Mobile Menu */}
// <div className="lg:hidden">
//     <MenuOutlined
//         className="text-white text-2xl cursor-pointer"
//         onClick={() => setDrawerOpen(true)}
//     />
// </div>
{/* Мобильное меню */ }
// <Drawer
//     title={<span className="text-lg font-semibold text-gray-800">Меню</span>}
//     placement="right"
//     onClose={() => setDrawerOpen(false)}
//     open={isDrawerOpen}
//     closeIcon={<CloseOutlined className="text-gray-600" />}
//     style={{ padding: 0 }}
// >
//     <div className="flex flex-col p-4">
//         {/* Список ссылок */}
//         <div className="flex flex-col space-y-3">
//             {platformMenu.map((menuItem) => (
//                 <Link
//                     key={menuItem.key}
//                     href={menuItem.link}
//                     className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${pathName === menuItem.link
//                         ? "bg-blue-100 text-blue-600 font-semibold"
//                         : "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
//                         }`}
//                     onClick={() => setDrawerOpen(false)} // Закрытие меню после клика
//                 >
//                     {menuItem.icon} {/* Иконка пункта меню */}
//                     <span>{menuItem.title}</span>
//                 </Link>
//             ))}
//         </div>

//         {/* Разделитель */}
//         <div className="border-t my-4"></div>

//         {/* Меню пользователя */}
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
//                                     userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
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
//                 {/* Опции пользователя */}
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
