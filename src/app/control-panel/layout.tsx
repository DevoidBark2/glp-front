"use client"
import React, { Suspense, useEffect, useState } from "react";
import { Button, Divider, Menu, MenuProps, Modal, Skeleton, Upload } from "antd";
import Link from "next/link";
import Image from "next/image"
import { observer } from "mobx-react";
import ThemeSwitch from "@/components/ThemeSwitch";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { UserType } from "@/components/Header/Header";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/enums/UserRoleEnum";
import {
    AppstoreOutlined,
    BarsOutlined,
    BookOutlined, LogoutOutlined,
    PartitionOutlined, SettingOutlined,
    SolutionOutlined,
    ToolOutlined, UploadOutlined, UserOutlined,StarOutlined
} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import nextConfig from "next.config.mjs";

const dark_color = "#e3d"
const text1 = "#121212"
const text2 = "#bbcaa3"
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
                key: 'manage-sections',
                label: <Link href={"/control-panel/manage-sections"}>Управление разделами</Link>,
                title: "Управление разделами",
                icon: <PartitionOutlined />,
            },
            {
                key: 'manage-components',
                label: <Link href={"/control-panel/manage-component"}>Управление компонентами</Link>,
                title: "Управление компонентами",
                icon: <SolutionOutlined />
            },
            {
                key: 'manage-posts',
                label: <Link href={"/control-panel/manage-posts"}>Управление постами</Link>,
                title: "Управление компонентами",
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
    {
        key: 'banners',
        label: <Link href={"/control-panel/banners"}>Баннеры</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'settings',
        label: <Link href={"/control-panel/settings"}>Настройки</Link>,
        icon: <SettingOutlined />,
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
            {
                key: 'avatar_icons',
                label: <Link href={"/control-panel/avatar-icons"}>Иконки пользователя</Link>,
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
                label: <Link href={"/control-panel/events"}>События пользователей</Link>,
                icon: <BarsOutlined />,
            },
        ]
    },
    {
        key: 'users',
        label: <Link href={"/control-panel/users"}>Пользователи</Link>,
        icon: <BarsOutlined />,
    },
    {
        key: 'feedbacks',
        label: <Link href={"/control-panel/feedbacks"}>Обратная связь</Link>,
        icon: <BarsOutlined />,
    },
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
    {
        key: 'platform',
        label: <Link href={"/platform"}>Вернуться на платформу</Link>,
        icon: <LogoutOutlined />,
    },
];

const ControlPanelLayout = ({ children }: { children: React.ReactNode }) => {
    const { resolvedTheme } = useTheme()
    const { avatarIconsStore } = useMobxStores()

    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const pathName = usePathname();
    const selectedKey = findKeyByPathname(pathName, dashboardMenuItems)

    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {

        const user = getCookieUserDetails();
        setCurrentUser(user);
        if (user.user.role === UserRole.SUPER_ADMIN) {
            dashboardMenuItems = dashboardMenuItems.filter(menuItem => menuItem?.key !== "moderators_items")
        }

        if (user.user.role === UserRole.TEACHER) {
            dashboardMenuItems = dashboardMenuItems.filter(menuItem =>
                menuItem?.key !== "moderators_items"
                && menuItem?.key !== "banners"
                && menuItem?.key !== "settings"
                && menuItem?.key !== "nomenclature"
                && menuItem?.key !== "logging"
                && menuItem?.key !== "users"
            )
        }

        if (user.user.role === UserRole.MODERATOR) {
            dashboardMenuItems = dashboardMenuItems.filter(menuItem =>
                menuItem?.key !== "banners"
                && menuItem?.key !== "settings"
                && menuItem?.key !== "nomenclature"
                && menuItem?.key !== "logging"
                && menuItem?.key !== "users"
                && menuItem?.key !== "courses-parent"
                && menuItem?.key !== "posts"
                && menuItem?.key !== "feedbacks"
            )
        }
        setLoading(false)
    }, [])

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.user?.avatar || "/static/default_avatar.png");
    const [customImage, setCustomImage] = useState(null);

    const avatarOptions = [
        '/static/avatar1.png',
        '/static/avatar2.png',
        '/static/avatar3.png',
        '/static/avatar4.png',
    ];

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
    };

    const handleUpload = (file) => {
        const reader = new FileReader();
        // reader.onload = () => {
        //     setCustomImage(reader.result);
        // };
        reader.readAsDataURL(file);
        return false; // Prevent automatic upload
    };

    const showUploadModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = (color) => {
        setIsModalVisible(false);
        if (customImage) setSelectedAvatar(customImage); // Save the uploaded image
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [selectedColor, setSelectedColor] = useState<string>('#FF5733'); // Цвет по умолчанию

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setCustomImage(null); // Очищаем предварительный просмотр при выборе цвета
    };

    useEffect(() => {
        avatarIconsStore.getAllAvatarIcons();
    }, [])

    return (
        <div className="flex">
            <Modal
                title="Выберите аватар"
                open={isModalVisible}
                onOk={() => handleOk(selectedColor)}
                onCancel={handleCancel}
            >
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {avatarIconsStore.avatarIcons?.map((color, index) => (
                        <Image
                            crossOrigin='anonymous' src={`${nextConfig.env?.API_URL}${color.image}`}
                            key={index}
                            className={`border-2 rounded-full p-2 cursor-pointer ${selectedColor === color ? 'border-blue-500' : 'border-transparent'}`}
                            width={90}
                            height={90}
                            onClick={() => handleColorSelect(color)}
                        />
                    ))}
                </div>
            </Modal>
            <div className={`flex flex-col bg-white dark:bg-[#001529] h-screen p-6 shadow-xl dark:border-r`}>
                <div className="flex flex-col items-center justify-center mb-2">
                    <div className="relative mb-4">
                        <div className="relative rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-24 w-24 flex items-center justify-center overflow-hidden shadow-xl transform transition-all duration-300 hover:rotate-6 hover:scale-105">
                            {/*<Image*/}
                            {/*    src={selectedAvatar}*/}
                            {/*    alt="Аватар"*/}
                            {/*    width={90}*/}
                            {/*    height={90}*/}
                            {/*    className="rounded-full"*/}
                            {/*/>*/}
                            <div
                                className="absolute bottom-0 right-0 bg-red-600 rounded-full p-2 transform transition-transform hover:scale-110 cursor-pointer shadow-lg"
                                onClick={showUploadModal}
                            >
                                <Button type="text" icon={<UploadOutlined />} size="small" />
                            </div>
                        </div>
                    </div>

                    <Skeleton loading={loading} active>
                        <div className="flex flex-col items-center justify-center" style={{ width: 250 }}>
                            <h1 className={`text-[${text1}] dark:text-[${text2}] text-lg font-bold mb-1`}>{currentUser?.user?.user_name}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-gray-300 text-sm">{currentUser?.user.role}</span>
                                <div className="bg-green-400 h-3 w-3 rounded-full" title="Онлайн"></div>
                            </div>
                        </div>
                    </Skeleton>
                    <div className="flex items-center gap-6 mt-4">
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <ThemeSwitch />
                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white
                            text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity delay-150">
                                <Suspense>
                                    {resolvedTheme === "light" ? "Темная тема" : "Светлая тема"}
                                </Suspense>
                            </span>
                        </div>
                        {/*<div className="group relative cursor-pointer transform transition-transform hover:scale-110">*/}
                        {/*    <Image*/}
                        {/*        src="/static/notification_icon.svg"*/}
                        {/*        alt="Уведомления"*/}
                        {/*        width={30}*/}
                        {/*        height={30}*/}
                        {/*        className="hover:opacity-80"*/}
                        {/*    />*/}
                        {/*    <div className="absolute top-0 right-0 bg-red-600 rounded-full h-4 w-4 text-xs*/}
                        {/*    text-white flex items-center justify-center animate-bounce">3</div>*/}
                        {/*    <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black*/}
                        {/*        text-white text-xs rounded-lg px-2 py-1 opacity-0*/}
                        {/*        group-hover:opacity-100 transition-opacity delay-150"*/}
                        {/*    >*/}
                        {/*        Уведомления</span>*/}
                        {/*</div>*/}

                        {/*<div className="group relative cursor-pointer transform transition-transform hover:scale-110">*/}
                        {/*    <Link href={"/control-panel/settings"}>*/}
                        {/*        <Image*/}
                        {/*            src="/static/settings_panel_icon.svg"*/}
                        {/*            alt="Настройки"*/}
                        {/*            width={30}*/}
                        {/*            height={30}*/}
                        {/*            className="hover:opacity-80"*/}
                        {/*        />*/}
                        {/*    </Link>*/}
                        {/*    <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black*/}
                        {/*        text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100*/}
                        {/*        transition-opacity delay-150"*/}
                        {/*    >Настройки</span>*/}
                        {/*</div>*/}
                        <div className="group relative cursor-pointer transform transition-transform hover:scale-110">
                            <Link href={"/control-panel/profile"}>
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


                <Divider className="bg-gray-600 dark:bg-white" />
                {
                    !loading ? <Menu
                        style={{ width: 240 }}
                        defaultSelectedKeys={[selectedKey]}
                        mode="vertical"
                        items={dashboardMenuItems}
                        theme={resolvedTheme === "light" ? "light" : "dark"}

                    /> : <>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8].map(it => (
                                <Skeleton.Input key={it} active block style={{ width: 250, marginTop: 10 }} />
                            ))
                        }
                    </>
                }
            </div>
            <div className="p-6 w-full">
                {children}
            </div>
        </div>

    );
}


export default observer(ControlPanelLayout);