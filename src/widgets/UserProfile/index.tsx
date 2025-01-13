import { Avatar, message, notification, Spin, Upload } from "antd";
import {CameraOutlined,UserOutlined} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import "react-phone-input-2/lib/bootstrap.css";
import {ProfileForm} from "@/entities/user-profile/ui/ProfileForm";
import nextConfig from "../../../next.config.mjs";

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
        <div className="w-2/5 bg-white flex flex-col rounded-md shadow-lg p-6 transition-all duration-300">
            <div className="flex justify-center">
                <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        handleAvatarUpload(file);
                        return false;
                    }}
                >
                    <div className="relative cursor-pointer transition-transform hover:scale-105">
                        {userProfileStore.uploadingProfileImage ? (
                            <Spin
                                size="large"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                }}
                            />
                        ) : null}
                        <Avatar
                            size={130}
                            src={userProfileStore.userAvatar || undefined}
                            icon={!userProfileStore.userAvatar && <UserOutlined/>}
                            className="cursor-pointer"
                            style={{
                                opacity: userProfileStore.uploadingProfileImage ? 0.5 : 1,
                                transition: 'opacity 0.3s ease',
                            }}
                        />

                        <div
                            className="absolute bottom-5 right-5 bg-white rounded-full shadow-lg p-2 flex items-center justify-center"
                            style={{
                                transform: 'translate(50%, 50%)',
                            }}
                        >
                            <CameraOutlined style={{fontSize: 18, color: '#595959'}}/>
                        </div>
                    </div>
                </Upload>
            </div>

            <ProfileForm/>
        </div>
    )
})