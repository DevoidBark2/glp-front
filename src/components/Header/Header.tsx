"use client"
import React, {useEffect, useState} from 'react';
import {platformMenu} from "@/app/constans";
import Link from "next/link";
import {Avatar, Badge, Modal, Spin} from "antd";
import Image from "next/image"
import {usePathname, useRouter} from "next/navigation";
import {Button, Dropdown, MenuProps} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import {getCookieUserDetails, getUserRole} from "@/lib/users";
import LoginPage from "@/app/login/page";
import LoginComponent from "@/components/LoginComponent/LoginComponent";


const HeaderBlock = () => {

    const {userStore} = useMobxStores();
    const [loading,setLoading] = useState<boolean>(false)
    const pathName = usePathname();
    const userRole: { role: string } | null = getUserRole();
    const [currentUser,setCurrentUser] = useState(null);

    const [items,setItems] = useState<MenuProps['items']>([
        {
            key: '1',
            label: (
                <div className="flex items-center">
                    <Image src="/static/profile_icon.svg" alt="Профиль" width={20} height={20}/>
                    <Link href={"/platform/profile"} className="ml-2 text-black hover:text-black">Мой профиль</Link>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div className="flex items-center">
                    <Image src="/static/control_panel_icon.svg" alt="Профиль" width={20} height={20}/>
                    <Link href={"/control_panel"} className="ml-2 text-black hover:text-black">Панель учителя</Link>
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div className="flex items-center">
                    <Image src="/static/settings_icon.svg" alt="Настройки" width={20} height={20}/>
                    <Link href={"/platform/settings"} className="ml-2 text-black hover:text-black">Настройки</Link>
                </div>
            ),
        },
        {
            key: '4',
            label: (
                <div className="flex items-center" onClick={() => userStore.logout()}>
                    <Image src="/static/logout_icon.svg" alt="Выйти из аккаунта" width={20} height={20}/>
                    <p className="ml-2 text-black hover:text-black">Выйти</p>
                </div>
            ),
        },
    ]);

    useEffect(() => {
        setLoading(true)
        if (userRole !== null && userRole.role === "student") {
            setItems(items?.filter(item => item?.key !== '2'));
        }

        const user = getCookieUserDetails();
        setCurrentUser(user);
        setLoading(false)
    }, [])

    console.log(currentUser)
    return <>
        <Modal
            open={userStore.openLoginModal}
            title="Авторизация"
            onCancel={() => userStore.setOpenLoginModal(false)}
            footer={null}
        >
           <LoginComponent/>
        </Modal>
        <div className="bg-[#00B96B] p-6">
            <div className="flex justify-between container mx-auto items-center">
                <div className="flex items-center">
                    <div>
                        <Image src="/static/Logo_3.svg" alt="" width={250} height={20}/>
                    </div>
                    <div className="flex ml-10">
                        {
                            platformMenu.map((menuItem) => (
                                <Link
                                    key={menuItem.key}
                                    href={menuItem.link}
                                    className={`text-white hover:border-b-2 border-b-indigo-500 ml-5 ${pathName === menuItem.link ? 'border-b-2 border-b-indigo-500' : ''}`}
                                >
                                    {menuItem.title}
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <div>
                    {
                        loading ? <Spin size="large"/> : currentUser ? <Dropdown menu={{items}} placement="bottomLeft">
                            <div className="flex items-center">
                                <Badge count={1}>
                                    <Avatar shape="square" icon={<UserOutlined/>}/>
                                </Badge>
                                <div className="text-white ml-2">{currentUser.user.user_name}</div>
                            </div>
                        </Dropdown> : <div>
                            <Button onClick={() => userStore.setOpenLoginModal(true)}>Войти в профиль</Button>
                        </div>
                    }

                </div>
            </div>
        </div>
    </>;
}

export default observer(HeaderBlock);