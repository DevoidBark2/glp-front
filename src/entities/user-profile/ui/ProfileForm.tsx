import { Form, Input } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react";
import { UserProfile } from "@/entities/user-profile/model/UserProfileStore";
import CyberInput from "@/shared/ui/Cyberpunk/CyberInput";
import CyberNotification from "@/shared/ui/Cyberpunk/CyberNotification";

export const ProfileForm = observer(() => {
    const { userProfileStore } = useMobxStores();
    const [formProfile] = Form.useForm<UserProfile>();

    // Функция для воспроизведения звука ошибки
    const playErrorSound = () => {
        const errorSound = new Audio('/sounds/error_sound.wav');
        errorSound.play();
    };

    // Функция для воспроизведения звука успешного сохранения
    const playSuccessSound = () => {
        const successSound = new Audio('/sounds/error_sound.wav');
        successSound.play();
    };

    const handleUpdateProfile = (values: UserProfile) => {
        userProfileStore.updateProfile(values).then((response) => {

        });
    }

    return (
        <Form
            form={formProfile}
            style={{width: "100%"}}
            layout="vertical"
            initialValues={userProfileStore.userProfile!}
            onFinish={handleUpdateProfile}
            onFinishFailed={() => playErrorSound()}
        >
            <Form.Item
                name="first_name"
                label={<label className="text-white text-lg">Имя</label>}
                rules={[{ required: true, message: "Поле обязательно!" }]}
            >
                <CyberInput
                    placeholder="Введите имя"
                />
            </Form.Item>

            <Form.Item
                name="second_name"
                label={<label className="text-white text-lg">Фамилия</label>}
            >
                <CyberInput
                    placeholder="Введите фамилию"
                />
            </Form.Item>

            <Form.Item
                name="last_name"
                label={<label className="text-white text-lg">Отчество</label>}
            >
                <CyberInput
                    placeholder="Введите отчество"
                />
            </Form.Item>

            <Form.Item
                name="email"
                label={<label className="text-white text-lg">Email</label>}
            >
                <CyberInput
                    disabled
                    placeholder="Введите email"
                />
            </Form.Item>

            <Form.Item
                name="phone"
                label={<label className="text-white text-lg">Телефон</label>}
            >
                <PhoneInput
                    inputStyle={{ width: '100%', height: '20px',color: "white", background: "transparent" }}
                    country={"ru"}
                    enableSearch={true}
                    searchPlaceholder={"Пожалуйста, введите телефонный номер!"}
                />
            </Form.Item>

            <div className="flex justify-end items-center mt-4">
                <Form.Item>
                    <button
                        type="submit"
                        className="px-6 py-3 border-2 border-yellow-400 text-yellow-300 font-bold text-lg uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-transparent hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-md clip-cyber"
                        onClick={() => playSuccessSound()} // Звук при успешном сохранении
                    >
                        Сохранить
                    </button>
                </Form.Item>
            </div>
        </Form>
    );
});
