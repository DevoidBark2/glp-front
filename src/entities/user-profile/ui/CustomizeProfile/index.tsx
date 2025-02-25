import { observer } from "mobx-react";
import { Avatar, Button, Tabs, Radio } from "antd";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import nextConfig from "../../../../../next.config.mjs";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMobxStores } from "@/shared/store/RootStore";

const frames = [
    { id: "gold", name: "Золото", className: "border-4 border-yellow-400 shadow-lg shadow-yellow-300" },
    { id: "silver", name: "Серебро", className: "border-4 border-gray-400 shadow-lg shadow-gray-300" },
    { id: "bronze", name: "Бронза", className: "border-4 border-orange-600 shadow-lg shadow-orange-400" },
    { id: "neon", name: "Неон", className: "border-4 border-blue-400 shadow-lg shadow-blue-400 animate-pulse" },
    { id: "gradient", name: "Градиент", className: "border-4 bg-gradient-to-r from-purple-400 to-pink-500" },
    { id: "double", name: "Двойная рамка", className: "border-8 border-white border-double" },
    { id: "glow", name: "Свечение", className: "border-4 border-blue-400 shadow-2xl shadow-blue-500" },
    { id: "none", name: "Без рамки", className: "" },
];

const backgrounds = [
    { id: "blue", name: "Синий", className: "bg-blue-500" },
    { id: "red", name: "Красный", className: "bg-red-500" },
    { id: "green", name: "Зеленый", className: "bg-green-500" },
    { id: "purple", name: "Фиолетовый", className: "bg-purple-500" },
    { id: "dark", name: "Тёмный", className: "bg-gray-800" },
    { id: "gradient", name: "Градиент", className: "bg-gradient-to-r from-blue-500 to-pink-500" },
    { id: "texture", name: "Текстура", className: "bg-[url('/textures/bg-texture.png')] bg-cover" },
    { id: "none", name: "Без фона", className: "" },
];

const shapes = [
    { id: "circle", name: "Круг", className: "rounded-full" },
    { id: "square", name: "Квадрат", className: "rounded-none" },
    { id: "rounded", name: "Скругленный", className: "rounded-lg" },
];

const sizes = [
    { id: "small", name: "Маленький", size: 100 },
    { id: "medium", name: "Средний", size: 150 },
    { id: "large", name: "Большой", size: 200 },
];

export const CustomizeProfile = observer(() => {
    const { userProfileStore } = useMobxStores();
    const [selectedFrame, setSelectedFrame] = useState("none");
    const [selectedBackground, setSelectedBackground] = useState("none");
    const [selectedShape, setSelectedShape] = useState("circle");
    const [selectedSize, setSelectedSize] = useState("medium");

    const saveCustomization = () => {
        console.log("Выбраны:", selectedFrame, selectedBackground, selectedShape, selectedSize);
    };

    const avatarSize = sizes.find((s) => s.id === selectedSize)?.size || 150;

    return (
        <div className="flex flex-col items-start">
            <h1 className="text-4xl font-extrabold mb-8">
                Кастомизация профиля
            </h1>

            {/* Превью аватара */}
            <div
                className={`p-5 shadow-2xl transition-all duration-300 flex justify-center items-center ${backgrounds.find(b => b.id === selectedBackground)?.className || ""}`}
            >
                <Avatar
                    size={avatarSize}
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
                    className={`${frames.find(f => f.id === selectedFrame)?.className || ""} ${shapes.find(s => s.id === selectedShape)?.className || ""} transition-all duration-300`}
                />
            </div>

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: "1",
                        label: "Рамка",
                        children: (
                            <div className="mt-8 w-full max-w-2xl">
                                <h3 className="text-xl font-semibold mb-4 text-center">Выберите рамку:</h3>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    {frames.map((frame) => (
                                        <div
                                            key={frame.id}
                                            className={`cursor-pointer p-3 rounded-xl transition-all border-4 ${
                                                selectedFrame === frame.id ? "border-blue-500 shadow-xl scale-105" : "border-gray-600"
                                            }`}
                                            onClick={() => setSelectedFrame(frame.id)}
                                        >
                                            <div className={`w-16 h-16 ${frame.className}`}></div>
                                            <p className="text-sm mt-2 text-center">{frame.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "2",
                        label: "Фон",
                        children: (
                            <div className="mt-8 w-full max-w-2xl">
                                <h3 className="text-xl font-semibold mb-4 text-center">Выберите фон:</h3>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    {backgrounds.map((bg) => (
                                        <div
                                            key={bg.id}
                                            className={`cursor-pointer p-3 rounded-xl transition-all border-4 ${
                                                selectedBackground === bg.id ? "border-blue-500 shadow-xl scale-105" : "border-gray-600"
                                            }`}
                                            onClick={() => setSelectedBackground(bg.id)}
                                        >
                                            <div className={`w-16 h-16 ${bg.className}`}></div>
                                            <p className="text-sm mt-2 text-center">{bg.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: "3",
                        label: "Форма",
                        children: (
                            <Radio.Group value={selectedShape} onChange={(e) => setSelectedShape(e.target.value)}>
                                {shapes.map((shape) => (
                                    <Radio key={shape.id} value={shape.id}>
                                        {shape.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        ),
                    },
                    {
                        key: "4",
                        label: "Размер",
                        children: (
                            <Radio.Group value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                {sizes.map((size) => (
                                    <Radio key={size.id} value={size.id}>
                                        {size.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        ),
                    },
                ]}
            />

            <Button type="primary" className="mt-10 px-6 py-3 text-lg bg-blue-500 hover:bg-blue-700 transition-all rounded-xl shadow-lg hover:shadow-2xl" onClick={saveCustomization}>
                Сохранить изменения
            </Button>
        </div>
    );
});
