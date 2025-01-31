import {Button, Form, Input} from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {SaveOutlined} from "@ant-design/icons";
import {UserProfile} from "@/stores/UserProfileStore";
import {useMobxStores} from "@/shared/store/RootStore";
import {observer} from "mobx-react";

export const ProfileForm = observer(() => {
    const { userProfileStore } = useMobxStores();
    const [formProfile] = Form.useForm<UserProfile>();
    return (
        <Form
            form={formProfile}
            layout="vertical"
            initialValues={userProfileStore.userProfile!}
            onFinish={(values) => userProfileStore.updateProfile(values)}
        >
            <Form.Item
                name="first_name"
                label="Имя"
                rules={[{ required: true, message: "Поле обязательно!" }]}
            >
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
                    disabled
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
                        >
                            Сохранить
                        </Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
    )
})