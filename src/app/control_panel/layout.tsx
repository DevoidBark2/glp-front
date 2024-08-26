"use client"
import React, {Suspense, useEffect, useState} from "react";
import {Divider, Menu, Skeleton, Spin} from "antd";
import Link from "next/link";
import Image from "next/image"
import {dashboardMenuItems, MenuItem} from "@/utils/dashboardMenu";
import {observer} from "mobx-react";
import ThemeSwitch from "@/components/ThemeSwitch";
import {useTheme} from "next-themes";
import {lightTheme} from "@/themes/light_theme";
import {darkTheme} from "@/themes/dark_theme";
import {usePathname} from "next/navigation";
import {UserType} from "@/components/Header/Header";
import {getCookieUserDetails} from "@/lib/users";
import {set} from "mobx";

const dark_color = "#e3d"
const text1 = "#fe3"
const text2 = "#bbcaa3"
const findKeyByPathname = (pathName: string, items: any): string => {
    debugger
    if (!items.length) return '0';
    for (const item of items) {
        debugger
        const it = item as any
        if (pathName.endsWith(item.key)) {
            return it.key;
        }
    }
    return findKeyByPathname(pathName, items.map((i:any) => i.children).flat().filter(Boolean))

}

const ControlPanelLayout = ({ children } : { children: React.ReactNode}) => {
    const { resolvedTheme } = useTheme()

    const [currentUser,setCurrentUser] = useState<UserType | null>(null);
    const pathName = usePathname();
    const selectedKey = findKeyByPathname(pathName, dashboardMenuItems)

    const [loading,setLoading] = useState<boolean>(true)
    useEffect(() => {

        const user = getCookieUserDetails();
        setCurrentUser(user);
        setLoading(false)
    }, [])

    return (
        <div className="flex">
            <div className={`flex flex-col bg-white dark:bg-[${dark_color}] h-screen p-6 shadow-xl`}>
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="relative mb-4">
                        <div className="relative rounded-full bg-gradient-to-r from-green-400 via-blue-500
                        to-purple-600 h-24 w-24 flex items-center justify-center overflow-hidden shadow-xl transform
                        transition-all duration-300 hover:rotate-6 hover:scale-105">
                            <div className="absolute top-0 right-0 bg-red-600 rounded-full p-2 transform
                                transition-transform hover:scale-110 cursor-pointer shadow-lg">
                                <Image
                                    src="/static/logout_icon.svg"
                                    alt="Выйти"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                    </div>

                    {!loading ?
                        <>
                            <h1 className={`text-[${text1}] dark:text-[${text2}] text-lg font-bold mb-1`}>{currentUser?.user?.user_name}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-gray-300 text-sm">Администратор</span>
                                <div className="bg-green-400 h-3 w-3 rounded-full" title="Онлайн"></div>
                            </div>
                        </> : <Skeleton.Input active block={true} style={{width: 260}}/>}

                    <div className="flex items-center gap-6 mt-6">
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <ThemeSwitch/>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white
                            text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity delay-150">
                                    <Suspense>
                                        {resolvedTheme === "light" ? "Темная тема" : "Светлая тема"}
                                    </Suspense>
                            </span>
                        </div>
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Image
                                src="/static/notification_icon.svg"
                                alt="Уведомления"
                                width={30}
                                height={30}
                                className="hover:opacity-80"
                            />
                            <div className="absolute top-0 right-0 bg-red-600 rounded-full h-4 w-4 text-xs
                            text-white flex items-center justify-center animate-bounce">3</div>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black
                                text-white text-xs rounded-lg px-2 py-1 opacity-0
                                group-hover:opacity-100 transition-opacity delay-150"
                            >
                                Уведомления</span>
                        </div>

                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Link href={"/control_panel/settings"}>
                                <Image
                                    src="/static/settings_panel_icon.svg"
                                    alt="Настройки"
                                    width={30}
                                    height={30}
                                    className="hover:opacity-80"
                                />
                            </Link>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black
                                text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100
                                transition-opacity delay-150"
                            >Настройки</span>
                        </div>
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Link href={"/control_panel/profile"}>
                                <Image
                                    src="/static/profile_panel_icon.svg"
                                    alt="Профиль"
                                    width={30}
                                    height={30}
                                    className="hover:opacity-80"
                                />
                            </Link>
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white
                                text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity delay-150"
                            >Профиль</span>
                        </div>
                    </div>
                </div>


                <Divider className="bg-gray-600 dark:bg-white"/>
                <Menu
                    style={{width: 240}}
                    defaultSelectedKeys={[selectedKey]}
                    mode="vertical"
                    items={dashboardMenuItems}
                />
            </div>
            <div className="p-6 w-full">
                {children}
            </div>
        </div>

    );
}


export default observer(ControlPanelLayout);