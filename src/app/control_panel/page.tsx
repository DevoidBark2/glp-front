"use client"
import {observer} from "mobx-react";
import {Input} from "antd";
import Image from "next/image";

const ControlPanel = () => {
    return(
        <div>
            <div className="flex items-center justify-between">
                <div className="w-1/4">
                    <Input placeholder="Поиск" allowClear />
                </div>
                <div className="flex items-center gap-2">
                    <Image src="/static/light_theme_icon.svg" alt="Светлая тема" width={30} height={30}/>
                    <Image src="/static/notification_icon.svg" alt="Уведомление" width={40} height={40}/>
                    <Image src="/static/settings_panel_icon.svg" alt="Настройки" width={30} height={30}/>
                    <Image src="/static/profile_panel_icon.svg" alt="Настройки" width={30} height={30}/>
                </div>
            </div>
        </div>
    )
}

export default observer(ControlPanel)