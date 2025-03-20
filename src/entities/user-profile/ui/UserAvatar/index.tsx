import {UserOutlined} from "@ant-design/icons";
import {Avatar} from "antd";
import React from "react";

import {User} from "@/shared/api/user/model";
import {AuthMethodEnum} from "@/shared/api/auth/model";

import nextConfig from "../../../../../next.config.mjs";

interface IUserAvatarProps {
    currentUser: User | null
    size: number
}

export const UserAvatar = ({currentUser,size} :IUserAvatarProps) => <Avatar
        shape="square"
        size={size}
        src={
            currentUser?.profile_url
                ? currentUser?.method_auth === AuthMethodEnum.GOOGLE ||
                currentUser?.method_auth === AuthMethodEnum.YANDEX
                    ? currentUser?.profile_url
                    : `${nextConfig.env?.API_URL}${currentUser?.profile_url}`
                : undefined
        }
        icon={!currentUser?.profile_url && <UserOutlined />}
    />