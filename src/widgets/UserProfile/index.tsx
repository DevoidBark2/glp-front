import React from "react";
import { Avatar, Divider, message, Spin, Upload } from "antd";
import {UploadOutlined, UserOutlined} from "@ant-design/icons";
import { observer } from "mobx-react";

import "react-phone-input-2/lib/bootstrap.css";
import { useTheme } from "next-themes";

import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import { ProfileForm } from "@/entities/user-profile";

import nextConfig from "../../../next.config.mjs";



export const UserProfileBlock = observer(() => {
    const { userProfileStore } = useMobxStores();
    const { resolvedTheme } = useTheme();


    const handleAvatarUpload = async (file: File) => {
        userProfileStore.setUploadingProfileImage(true);
        try {
            await userProfileStore.uploadAvatar(file);
        } catch (error) {
            message.error("Ошибка загрузки аватара");
        } finally {
            userProfileStore.setUploadingProfileImage(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl dark:text-white">Профиль пользователя</h1>
            <Divider style={{ borderColor: resolvedTheme === "dark" ? "gray" : undefined }} />
            <div className="w-full flex flex-col md:flex-row p-6">
                <div className="flex flex-col mr-10 mb-5">
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            handleAvatarUpload(file);
                            return false;
                        }}
                    >
                        <div className="relative cursor-pointer">
                            {userProfileStore.uploadingProfileImage ? (
                                <Spin size="large" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            ) : null}
                            <div className="mb-5">
                                <Avatar
                                    size={200}
                                    shape="square"
                                    src={
                                        userProfileStore.userProfile?.image
                                            ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
                                                userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
                                                ? userProfileStore.userProfile?.image
                                                : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
                                            : undefined
                                    }
                                    icon={!userProfileStore.userAvatar && <UserOutlined />}
                                    className="border-4 border-neon-blue"
                                    style={{ opacity: userProfileStore.uploadingProfileImage ? 0.5 : 1 }}
                                />
                                <UploadOutlined className="absolute bottom-1 right-1 bg-white p-2 rounded"/>
                            </div>
                        </div>
                    </Upload>
                </div>

                <ProfileForm />
            </div>
        </>
    );
});
