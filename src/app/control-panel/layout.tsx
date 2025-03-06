"use client"
import React, { useEffect, useState } from "react";
import { Avatar, Divider, Menu, MenuProps, Skeleton, Spin } from "antd";
import Link from "next/link";
import { observer } from "mobx-react";
import {usePathname, useRouter} from "next/navigation";
import {
    AppstoreOutlined,
    BarsOutlined, LogoutOutlined,
    SettingOutlined, StarOutlined, UserOutlined
} from "@ant-design/icons";
import { UserRole } from "@/shared/api/user/model";
import nextConfig from "../../../next.config.mjs";
import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import {useTheme} from "next-themes";

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
    // {
    //     key: 'moderators_items',
    //     type: "submenu",
    //     label: 'Панель модератора',
    //     icon: <ToolOutlined />,
    //     children: [
    //         {
    //             key: 'manage-courses',
    //             label: <Link href={"/control-panel/manage-courses"}>Управление курсами</Link>,
    //             title: "Управление курсами",
    //             icon: <BookOutlined />,
    //         },
    //         {
    //             key: 'manage-posts',
    //             label: <Link href={"/control-panel/manage-posts"}>Управление постами</Link>,
    //             title: "Управление постами",
    //             icon: <SolutionOutlined />
    //         },
    //     ]
    // },
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
                key: 'components',
                label: <Link href={"/control-panel/components"}>Компоненты</Link>,
                icon: <BarsOutlined />,
            },
            {
                key: 'exams',
                label: <Link href={"/control-panel/exams"}>Экзамены</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'posts',
        label: <Link href={"/control-panel/posts"}>Посты</Link>,
        icon: <BarsOutlined />,
    },
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
    {
        key: 'logging',
        label: 'Логирование',
        icon: <BarsOutlined />,
        children: [
            {
                key: 'events',
                label: <Link href={"/control-panel/events"}>Журнал аудита</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
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
    // {
    //     key: 'general',
    //     label: 'Общее',
    //     icon: <BarsOutlined />,
    //     children: [
    //         {
    //             key: 'faq',
    //             label: <Link href={"/control-panel/faq"}>Вопросы и ответы</Link>,
    //             icon: <BarsOutlined />,
    //         },
    //         // {
    //         //     key: 'support',
    //         //     label: <Link href={"/control-panel/support"}>Поддержка</Link>,
    //         //     icon: <BarsOutlined />,
    //         // }
    //     ]
    // },
    {
        key: 'profile',
        label: <Link href={"/control-panel/profile"}>Профиль</Link>,
        icon: <UserOutlined />,
    },
    {
        type: 'divider',
    },
    {
        key: 'achievements',
        label: <Link href={"/control-panel/achievements"}>Достижения</Link>,
        icon: <StarOutlined />,
    },
    // {
    //     key: "manual",
    //     label: <Link href={"/control-panel/manual"}>Руководство пользователя</Link>,
    //     icon: <BookOutlined />,
    // },
    {
        key: 'platform',
        label: <Link href={"/platform"}>Вернуться на платформу</Link>,
        icon: <LogoutOutlined />,
    },
];

const ControlPanelLayout = ({ children }: { children: React.ReactNode }) => {
    const { userProfileStore } = useMobxStores()
    const pathName = usePathname();
    const theme = useTheme();
    const router = useRouter()
    const selectedKey = findKeyByPathname(pathName, dashboardMenuItems)

    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {

        userProfileStore.getUserProfile().then((response) => {
            if (response.role === UserRole.STUDENT) {
                router.push("/platform");
                return;
            }
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
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    if(loading) {
        return <div className="w-full flex justify-center h-screen items-center">
            <Spin size="large"/>
        </div>
    }

    return (
        !loading && userProfileStore.userProfile?.role !== UserRole.STUDENT && <div className="flex">
            <div className={`flex flex-col bg-white dark:bg-[#001529] h-screen p-6 shadow-xl dark:border-r`}>
                <div className="flex flex-col items-center justify-center mb-2">
                    <div className="relative mb-4 flex items-center justify-center">
                        <div className="relative rounded-full overflow-hidden shadow-lg bg-gray-200">
                            <Spin spinning={loading}>
                                <Avatar
                                    size={100}
                                    src={
                                        userProfileStore.userProfile?.image
                                            ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
                                            userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
                                                ? userProfileStore.userProfile?.image
                                                : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
                                            : undefined
                                    }
                                    icon={!userProfileStore.userAvatar && <UserOutlined />}
                                    className="cursor-pointer"
                                    style={{
                                        opacity: userProfileStore.uploadingProfileImage ? 0.5 : 1,
                                        transition: 'opacity 0.3s ease',
                                    }}
                                />
                            </Spin>
                        </div>
                    </div>


                    <Skeleton loading={loading} active>
                        <div className="flex flex-col items-center justify-center" style={{ width: 250 }}>
                            <h1 className="text-lg font-bold mb-1 text-center">{`${userProfileStore.userProfile?.second_name ?? ''} ${userProfileStore.userProfile?.first_name ?? ''} ${userProfileStore.userProfile?.last_name ?? ''}`}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-gray-300 text-sm">{userProfileStore.userProfile?.role}</span>
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
                            selectedKeys={[selectedKey]}
                            defaultSelectedKeys={[selectedKey]}
                            mode="vertical"
                            items={dashboardMenuItems}
                            theme={theme.theme === "dark" ? "dark" : "light"}
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

            <div className="p-6 w-full">
                {children}
            </div>
        </div>
    );
}


export default observer(ControlPanelLayout);