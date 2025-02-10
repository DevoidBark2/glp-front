import { Avatar, message, notification, Spin, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import "react-phone-input-2/lib/bootstrap.css";
import { ProfileForm } from "@/entities/user-profile/ui/ProfileForm";
import nextConfig from "../../../next.config.mjs";
import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import CyberNotification from "@/shared/ui/Cyberpunk/CyberNotification";
import dayjs from "dayjs";
import {FORMAT_VIEW_DATE} from "@/shared/constants";

export const UserProfileBlock = observer(() => {
    const { userProfileStore } = useMobxStores();

    const handleAvatarUpload = async (file: File) => {
        userProfileStore.setUploadingProfileImage(true);
        try {
            const response = await userProfileStore.uploadAvatar(file);
            userProfileStore.setUserAvatar(`${nextConfig.env?.API_URL}${response.data}`);
            notification.success({ message: response.message });
        } catch (error) {
            message.error('Ошибка загрузки аватара');
        } finally {
            userProfileStore.setUploadingProfileImage(false);
        }
    };

    return (
        <div className="w-full flex p-6">
            <div className="flex flex-col mr-10">
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
                            <Spin
                                size="large"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            />
                        ) : null}
                        <Avatar
                            size={300}
                            shape="square"
                            src={
                                userProfileStore.userProfile?.image
                                    ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
                                    userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
                                        ? userProfileStore.userProfile?.image
                                        : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
                                    : undefined
                            }
                            icon={!userProfileStore.userAvatar && <UserOutlined/>}
                            className="border-4 border-neon-blue"
                            style={{opacity: userProfileStore.uploadingProfileImage ? 0.5 : 1}}
                        />
                    </div>
                </Upload>

                <div className="mt-4 text-xl text-neon-green font-mono">
                    {userProfileStore.userProfile?.created_at ? (
                        <span>
                <span className="text-white">Зарегистрирован:</span>
                <p className="text-cyber-yellow">
                    {dayjs(userProfileStore.userProfile.created_at).format(FORMAT_VIEW_DATE)}
                </p>
            </span>
                    ) : (
                        <span className="italic text-gray-500">Activation time not available</span>
                    )}
                </div>
            </div>

            <ProfileForm/>
        </div>
    )
})