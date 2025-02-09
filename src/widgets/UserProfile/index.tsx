import { Avatar, message, notification, Spin, Upload } from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import "react-phone-input-2/lib/bootstrap.css";
import { ProfileForm } from "@/entities/user-profile/ui/ProfileForm";
import nextConfig from "../../../next.config.mjs";
import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";

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
        <div className="w-full flex flex-col p-6">
            <div className="flex justify-center">
                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        handleAvatarUpload(file);
                        return false;
                    }}
                >
                    <div className="relative cursor-pointer transition-transform hover:scale-110">
                        {userProfileStore.uploadingProfileImage ? (
                            <Spin
                                size="large"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            />
                        ) : null}
                        <Avatar
                            size={130}
                            src={
                                userProfileStore.userProfile?.image
                                    ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
                                        userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
                                        ? userProfileStore.userProfile?.image
                                        : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
                                    : undefined
                            }
                            icon={!userProfileStore.userAvatar && <UserOutlined />}
                            className="cursor-pointer border-4 border-neon-blue shadow-[0_0_10px_#00FFFF]"
                            style={{ opacity: userProfileStore.uploadingProfileImage ? 0.5 : 1 }}
                        />
                        <div
                            className="absolute bottom-5 right-5 bg-neon-green rounded-full shadow-[0_0_10px_#39FF14] p-2 flex items-center justify-center transform translate-x-1/2 translate-y-1/2"
                        >
                            <CameraOutlined style={{ fontSize: 18, color: '#000' }} />
                        </div>
                    </div>
                </Upload>
            </div>

            <ProfileForm />
        </div>
    )
})