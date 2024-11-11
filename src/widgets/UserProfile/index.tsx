import { Avatar, Button, Form, Input, message, notification, Skeleton, Spin, Upload } from "antd";
import { SaveOutlined,UserOutlined} from "@ant-design/icons";
import { useState } from "react";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import { UserProfile } from "@/stores/UserProfileStore";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

export const UserProfileBlock = observer(() => {
    const {userProfileStore } = useMobxStores();
    const [formProfile] = Form.useForm<UserProfile>();
    const [loading, setLoading] = useState(false);


    // можно вынести ниже(так как испольузется в нижних слоях так же)
    const handleAvatarUpload = async (file: File) => {
        setLoading(true);
        try {
          const response = await userProfileStore.uploadAvatar(file);
          debugger
          userProfileStore.setUserAvatar(response.data);
          notification.success({ message: response.message });
        } catch (error) {
          message.error('Ошибка загрузки аватара');
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className="w-2/5 bg-white flex flex-col rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
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
                    {loading ? (
                        <Spin
                        size="large"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                        }}
                        />
                    ) : null}
                    <Avatar
                        size={130}
                        src={userProfileStore.userAvatar || undefined}
                        icon={!userProfileStore.userAvatar && <UserOutlined />}
                        className="cursor-pointer"
                        style={{
                        opacity: loading ? 0.5 : 1,
                        transition: 'opacity 0.3s ease',
                        }}
                    />
                    </div>
                </Upload>
            </div>

            <Form form={formProfile} layout="vertical" initialValues={userProfileStore.userProfile!}>
                    <Form.Item name="first_name" label="Имя">
                        <Input
                            className="h-12 rounded-md transition-all duration-300"
                            placeholder="Введите имя"
                        />
                    </Form.Item>

                    <Form.Item name="second_name" label="Фамилия">
                        <Input
                            className="h-12 rounded-md transition-all duration-300"
                            placeholder="Введите фамилию"
                        />
                    </Form.Item>

                    <Form.Item name="last_name" label="Очество">
                        <Input
                            className="h-12 rounded-md transition-all duration-300"
                            placeholder="Введите отчество"
                        />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input
                            className="h-12 rounded-md transition-all duration-300"
                            placeholder="Введите email"
                        />
                    </Form.Item>

                    <Form.Item name="phone" label="Телефон">
                        <PhoneInput
                            inputStyle={{ width: '100%', height: '20px' }}
                            country={"ru"}
                            enableSearch={true}
                            searchPlaceholder={"Пожалуйста, введите телефонный номер!"}
                        />
                    </Form.Item>

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex flex-col">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="transition-all duration-300 ease-in-out transform hover:scale-105"
                                    icon={<SaveOutlined />}
                                    onClick={() => userProfileStore.updateProfile(formProfile.getFieldsValue())}
                                >
                                    Сохранить
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
            </Form>
        </div>
    )
})