import { Button, Form, Input } from "antd";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";
import { observer } from "mobx-react";
import {useTheme} from "next-themes";

import { useMobxStores } from "@/shared/store/RootStore";
import { UserProfile } from "@/entities/user-profile/model/UserProfileStore";


export const ProfileForm = observer(() => {
    const { userProfileStore } = useMobxStores();
    const [formProfile] = Form.useForm<UserProfile>();
    const {resolvedTheme} = useTheme()

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
                label={<label className="dark:text-white">Имя</label>}
                rules={[{ required: true, message: "Поле обязательно!" }]}
            >
                <Input placeholder="Введите имя"
                    style={{
                        background: resolvedTheme === "dark" ? "#1a1a1a" : "white",
                        color: resolvedTheme === "dark" ? "white" : "black"
                }}
                />
            </Form.Item>

            <Form.Item
                name="second_name"
                label={<label className="dark:text-white">Фамилия</label>}
            >
                <Input
                    placeholder="Введите фамилию"
                    style={{
                        background: resolvedTheme === "dark" ? "#1a1a1a" : "white",
                        color: resolvedTheme === "dark" ? "white" : "black"
                    }}
                />
            </Form.Item>

            <Form.Item
                name="last_name"
                label={<label className="dark:text-white">Отчество</label>}
            >
                <Input
                    placeholder="Введите отчество"
                    style={{
                        background: resolvedTheme === "dark" ? "#1a1a1a" : "white",
                        color: resolvedTheme === "dark" ? "white" : "black",
                    }}
                />
            </Form.Item>

            <Form.Item
                name="email"
                label={<label className="dark:text-white">Email</label>}
            >
                <Input
                    placeholder="Введите email"
                    style={{
                        background: resolvedTheme === "dark" ? "#1a1a1a" : "white",
                        color: resolvedTheme === "dark" ? "white" : "black"
                    }}
                />
            </Form.Item>

            <Form.Item
                name="phone"
                label={<label className="dark:text-white">Телефон</label>}
            >
                <PhoneInput
                    disableSearchIcon={true}
                    inputStyle={{ width: '100%', height: '20px',background: resolvedTheme === "dark" ? "#1a1a1a" : "white",
                        color: resolvedTheme === "dark" ? "white" : "black"}}
                    country={"ru"}
                    enableSearch={false}
                    onlyCountries={["ru"]}
                    placeholder="+7 (999) 999-99-99"
                    masks={{ru: '(...) ...-..-..'}}
                    searchPlaceholder={"Пожалуйста, введите телефонный номер!"}
                />
            </Form.Item>

            <div className="flex justify-end items-center mt-4">
                <Form.Item>
                    <Button
                        htmlType="submit"
                        color="default" variant={resolvedTheme === "dark" ? "outlined": "solid"}
                        style={{ padding: "10px 43px" }}
                    >
                        Сохранить
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
});
