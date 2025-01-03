"use client"
import React, { useEffect, useState } from "react";
import { Divider, Menu, MenuProps, Skeleton } from "antd";
import Link from "next/link";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { getCookieUserDetails } from "@/lib/users";
import {
    AppstoreOutlined,
    BarsOutlined,
    BookOutlined, LogoutOutlined,
SettingOutlined,
    SolutionOutlined,
    ToolOutlined, UserOutlined
} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import nextConfig from "next.config.mjs";
import { UserRole } from "@/shared/api/user/model";
import {UserType} from "@/widgets";

const findKeyByPathname = (pathName: string, items: any): string => {
    if (!items.length) return '0';
    for (const item of items) {
        const it = item as any
        if (pathName.endsWith(item.key)) {
            return it.key;
        }
    }
    return findKeyByPathname(pathName, items.map((i: any) => i.children).flat().filter(Boolean))

}

export type MenuItem = Required<MenuProps>['items'][number];

let dashboardMenuItems: MenuItem[] = [
    {
        key: 'control-panel',
        label: <Link href={"/control-panel"}>Главная</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: 'moderators_items',
        type: "submenu",
        label: 'Панель модератора',
        icon: <ToolOutlined />,
        children: [
            {
                key: 'manage-courses',
                label: <Link href={"/control-panel/manage-courses"}>Управление курсами</Link>,
                title: "Управление курсами",
                icon: <BookOutlined />,
            },
            {
                key: 'manage-posts',
                label: <Link href={"/control-panel/manage-posts"}>Управление постами</Link>,
                title: "Управление постами",
                icon: <SolutionOutlined />
            },
        ]
    },
    {
        key: 'courses-parent',
        label: 'Курсы',
        icon: <BarsOutlined />,
        children: [
            {
                key: 'courses',
                label: <Link href={"/control-panel/courses"}>Ваши курсы</Link>,
                icon: <BarsOutlined />,
            },
            {
                key: 'sections',
                label: <Link href={"/control-panel/sections"}>Разделы</Link>,
                icon: <BarsOutlined />,
            },
            {
                key: 'tasks',
                label: <Link href={"/control-panel/tasks"}>Компоненты</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'posts',
        label: <Link href={"/control-panel/posts"}>Посты</Link>,
        icon: <BarsOutlined />,
    },
    // {
    //     key: 'banners',
    //     label: <Link href={"/control-panel/banners"}>Баннеры</Link>,
    //     icon: <BarsOutlined />,
    // },
    {
        key: 'nomenclature',
        label: 'Справочники',
        icon: <BarsOutlined />,
        children: [
            {
                key: 'category',
                label: <Link href={"/control-panel/category"}>Категории</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    // {
    //     key: 'logging',
    //     label: 'Логирование',
    //     icon: <BarsOutlined />,
    //     children: [
    //         {
    //             key: 'events',
    //             label: <Link href={"/control-panel/events"}>События пользователей</Link>,
    //             icon: <BarsOutlined />,
    //         },
    //     ]
    // },
    {
        key: 'users',
        label: <Link href={"/control-panel/users"}>Пользователи</Link>,
        icon: <BarsOutlined />,
    },
    // {
    //     key: 'feedbacks',
    //     label: <Link href={"/control-panel/feedbacks"}>Обратная связь</Link>,
    //     icon: <BarsOutlined />,
    // },
    {
        key: 'settings',
        label: <Link href={"/control-panel/settings"}>Настройки</Link>,
        icon: <SettingOutlined />,
    },
    {
        key: 'general',
        label: 'Общее',
        icon: <BarsOutlined />,
        children: [
            {
                key: 'faq',
                label: <Link href={"/control-panel/faq"}>Вопросы и ответы</Link>,
                icon: <BarsOutlined />,
            },
            // {
            //     key: 'support',
            //     label: <Link href={"/control-panel/support"}>Поддержка</Link>,
            //     icon: <BarsOutlined />,
            // }
        ]
    },
    {
        key: 'profile',
        label: <Link href={"/control-panel/profile"}>Профиль</Link>,
        icon: <UserOutlined />,
    },
    {
        type: 'divider',
    },
    // {
    //     key: 'achievements',
    //     label: <Link href={"/control-panel/achievements"}>Достижения</Link>,
    //     icon: <StarOutlined />,
    // },
    {
        key: 'platform',
        label: <Link href={"/platform"}>Вернуться на платформу</Link>,
        icon: <LogoutOutlined />,
    },
];

const ControlPanelLayout = ({ children }: { children: React.ReactNode }) => {
    const { resolvedTheme } = useTheme()
    const { userProfileStore } = useMobxStores()

    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const pathName = usePathname();
    const selectedKey = findKeyByPathname(pathName, dashboardMenuItems)

    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {

        userProfileStore.getUserProfile().then(response => {
            setCurrentUser(response)
            if (response.role === UserRole.SUPER_ADMIN) {
                dashboardMenuItems = dashboardMenuItems.filter(menuItem => menuItem?.key !== "moderators_items")
            }
    
            if (response.role === UserRole.TEACHER) {
                dashboardMenuItems = dashboardMenuItems.filter(menuItem =>
                    menuItem?.key !== "moderators_items"
                    && menuItem?.key !== "settings"
                    && menuItem?.key !== "nomenclature"
                    && menuItem?.key !== "logging"
                    && menuItem?.key !== "users"
                    && menuItem?.key !== "general"
                )
            }
    
            if (response.role === UserRole.MODERATOR) {
                dashboardMenuItems = dashboardMenuItems.filter(menuItem =>
                    menuItem?.key !== "settings"
                    && menuItem?.key !== "nomenclature"
                    && menuItem?.key !== "logging"
                    && menuItem?.key !== "users"
                    && menuItem?.key !== "courses-parent"
                    && menuItem?.key !== "posts"
                    && menuItem?.key !== "feedbacks"
                    && menuItem?.key !== "general"
                )
            }
        })

       
        setLoading(false)
    }, [])

    useEffect(() => {
        // userProfileStore.getUserProfile().then((response) => {
        //     const userData = response.data;

        //     if (userData.profile_url) {
        //         const fullAvatarUrl = `${nextConfig.env?.API_URL}${userData.profile_url}`;
        //         setAvatar(fullAvatarUrl);
        //     } else {
        //         setAvatar(null);
        //     }

        // }).finally(() => {
        //     userProfileStore.setLoading(false)
        // });
        // avatarIconsStore.getAllAvatarIcons();
    }, [])

    return (
        <>
            <div className="flex">
                <div className={`flex flex-col bg-white dark:bg-[#001529] h-screen p-6 shadow-xl dark:border-r`}>
                    <div className="flex flex-col items-center justify-center mb-2">
                        <div className="relative mb-4">
                            <div className="relative rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-24 w-24 flex items-center justify-center overflow-hidden shadow-xl transform transition-all duration-300">
                            </div>
                        </div>

                        <Skeleton loading={loading} active>
                            <div className="flex flex-col items-center justify-center" style={{ width: 250 }}>
                                <h1 className="text-lg font-bold mb-1 text-center">{currentUser?.first_name}</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-gray-300 text-sm">{currentUser?.role}</span>
                                    <div className="bg-green-400 h-3 w-3 rounded-full" title="Онлайн"></div>
                                </div>
                            </div>
                        </Skeleton>
                    </div>

                    <Divider className="bg-gray-600 dark:bg-white" />
                    {
                        !loading ? (
                            <Menu
                                style={{ width: 240 }}
                                defaultSelectedKeys={[selectedKey]}
                                mode="vertical"
                                items={dashboardMenuItems}
                                theme="light"
                            />
                        ) : (
                            <>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(it => (
                                    <Skeleton.Input key={it} active block style={{ width: 250, marginTop: 10 }} />
                                ))}
                            </>
                        )
                    }
                </div>

                {/* Контент справа от меню */}
                <div className="p-6 w-full">
                    {children}
                </div>
            </div>

        </>
    );
}


export default observer(ControlPanelLayout);