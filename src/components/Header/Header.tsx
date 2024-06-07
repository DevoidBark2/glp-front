"use client"
import React from 'react';
import {platformMenu} from "@/app/constans";
import Link from "next/link";
import {Avatar, Badge, Image} from "antd";
import {usePathname} from "next/navigation";
import {Button, Dropdown, MenuProps} from "antd";
import {UserOutlined} from "@ant-design/icons";

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <div className="flex items-center">
                <Image src="/static/profile_icon.svg" alt="Профиль" width={20} height={20}/>
                <Link href="/platform/profile" className="ml-2 text-black hover:text-black">Мой профиль</Link>
            </div>
        ),
    },
    {
        key: '2',
        label: (
            <div className="flex items-center">
                <Image src="/static/settings_icon.svg" alt="Настройки" width={20} height={20}/>
                <Link href="/platform/settings" className="ml-2 text-black hover:text-black">Настройки</Link>
            </div>
        ),
    },
    {
        key: '3',
        label: (
            <div className="flex items-center">
                <Image src="/static/logout_icon.svg" alt="Выйти из аккаунта" width={20} height={20}/>
                <p className="ml-2 text-black hover:text-black">Выйти</p>
            </div>
        ),
    },
];
const HeaderBlock = () => {

    const pathName = usePathname();

    return <div className="bg-[#00B96B] px-20 p-6 flex items-center justify-between">
        <div className="flex">
            <div className="border-dashed border-2 border-black-500 text-center">Логотип</div>
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
            <Dropdown menu={{ items }} placement="bottomLeft">
               <div className="flex items-center">
                   <Badge count={1}>
                       <Avatar shape="square" icon={<UserOutlined />} />
                   </Badge>
                   <div className="text-white ml-2">Петров Иван Михайлович</div>
               </div>
            </Dropdown>

        </div>
    </div>;
}

export default HeaderBlock;