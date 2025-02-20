import { Button, Form, Input } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react";
import { UserProfile } from "@/entities/user-profile/model/UserProfileStore";

export const ProfileForm = observer(() => {
    const { userProfileStore } = useMobxStores();
    const [formProfile] = Form.useForm<UserProfile>();

    const handleUpdateProfile = (values: UserProfile) => {
        userProfileStore.updateProfile(values);
    }

    return (
        <Form
            form={formProfile}
            style={{ width: "100%" }}
            layout="vertical"
            initialValues={userProfileStore.userProfile!}
            onFinish={handleUpdateProfile}
        >
            <Form.Item
                name="first_name"
                label="Имя"
                rules={[{ required: true, message: "Поле обязательно!" }]}
            >
                <Input placeholder="Введите имя" />
            </Form.Item>

            <Form.Item
                name="second_name"
                label="Фамилия"
            >
                <Input placeholder="Введите фамилию" />
            </Form.Item>

            <Form.Item
                name="last_name"
                label="Отчество"
            >
                <Input placeholder="Введите отчество" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
            >
                <Input placeholder="Введите email" disabled />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Телефон"
            >
                <PhoneInput
                    inputStyle={{ width: '100%', height: '20px' }}
                    country={"ru"}
                    enableSearch={false}
                    onlyCountries={["ru"]}
                    searchPlaceholder={"Пожалуйста, введите телефонный номер!"}
                />
            </Form.Item>

            <div className="flex justify-end items-center mt-4">
                <Form.Item>
                    <Button
                        htmlType="submit"
                        color="default" variant="solid"
                        style={{ padding: "10px 43px" }}
                    >
                        Сохранить
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
});
