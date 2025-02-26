import { observer } from "mobx-react";
import { useState } from "react";
import { Button, Divider, Tabs, Tooltip } from "antd";
import { useMobxStores } from "@/shared/store/RootStore";
import {userLevels} from "@/entities/user-profile";

const { TabPane } = Tabs;

const categories = {
    frames: [
        { id: "gold", name: "Золотая", className: "border-yellow-400", price: 500, minLevel: "Advanced" },
        { id: "silver", name: "Серебряная", className: "border-gray-400", price: 300, minLevel: "Novice" },
        { id: "bronze", name: "Бронзовая", className: "border-orange-500", price: 300, minLevel: "Novice" },
        { id: "red", name: "Красная", className: "border-red-500", price: 300, minLevel: "Skilled" },
        { id: "blue", name: "Синяя", className: "border-blue-500", price: 300, minLevel: "Skilled" },
        { id: "green", name: "Зеленая", className: "border-green-500", price: 300, minLevel: "Learner" },
        { id: "purple", name: "Фиолетовая", className: "border-purple-500", price: 300, minLevel: "Advanced" },
        { id: "black", name: "Черная", className: "border-black", price: 300, minLevel: "Expert" },
        { id: "white", name: "Белая", className: "border-white", price: 0, minLevel: "Beginner" },
        { id: "rainbow", name: "Радужная", className: "border-gradient-rainbow", price: 300, minLevel: "Grandmaster" },
        { id: "emerald", name: "Изумрудная", className: "border-green-700", price: 400, minLevel: "Expert" }, // Новая рамка (изумрудная)
        { id: "platinum", name: "Платиновая", className: "border-indigo-500", price: 600, minLevel: "Grandmaster" }, // Новая рамка (платиновая)
        { id: "diamond", name: "Алмазная", className: "border-blue-700", price: 800, minLevel: "Legendary" }, // Новая рамка (алмазная)
        { id: "ruby", name: "Рубиновая", className: "border-red-700", price: 700, minLevel: "Legendary" }, // Новая рамка (рубин)
    ],
    icons: [
        { id: "star", name: "⭐ Звезда", price: 200, minLevel: "Beginner" },
        { id: "heart", name: "❤️ Сердце", price: 250, minLevel: "Novice" },
        { id: "rocket", name: "🚀 Ракета", price: 350, minLevel: "Advanced" },
        { id: "crown", name: "👑 Корона", price: 500, minLevel: "Legend" },
    ],
    effects: [
        { id: "glow", name: "✨ Свечение", price: 300, minLevel: "Skilled" },
        { id: "shadow", name: "🌑 Тень", price: 200, minLevel: "Learner" },
        { id: "sparkle", name: "🌟 Искры", price: 150, minLevel: "Novice" },
        { id: "rainbow", name: "🌈 Радуга", price: 450, minLevel: "Grandmaster" },
    ]
};

export const CustomizeProfile = observer(() => {
    const { userProfileStore } = useMobxStores()
    const [previewModal, setPreviewModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState({
        frames: "none",
        backgrounds: "none",
        icons: null,
        effects: null,
    });

    // Функция для обработки выбора элемента
    const handleSelect = (category, itemId) => {
        setSelectedItems(prev => {
            const newSelectedItems = { ...prev };
            newSelectedItems[category] = itemId;
            return newSelectedItems;
        });
    };

    const totalCost = Object.entries(selectedItems).reduce((acc, [key, value]) => {
        const item = categories[key]?.find((el) => el.id === value);
        if (item) {
            return acc + item.price;
        }
        return acc; // Если элемент не найден, просто пропускаем
    }, 0);

    // Функция для удаления элемента
    const removeItem = (category) => {
        setSelectedItems(prev => {
            const newSelectedItems = { ...prev };
            newSelectedItems[category] = "none"; // удаляем элемент, устанавливаем на "none"
            return newSelectedItems;
        });
    };

    // Функция для покупки всех выбранных элементов
    const buyAll = () => {
        alert('Вы купили все выбранные элементы!');
        // Реализуйте логику покупки элементов
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">🎨 Маркетплейс для кастомизации профиля</h1>
            <div className="flex justify-end items-center">
                {/*<Button onClick={() => setPreviewModal(true)}>Предпросмотр</Button>*/}
                <Tooltip title="Ваш баланс">
                    <div className="flex items-center gap-2 text-lg font-semibold text-yellow-600">
                        💰 {userProfileStore.userProfile?.coins}
                    </div>
                </Tooltip>
            </div>
            <Divider />
            <div className="flex justify-between p-4">

                <div className="w-3/5">
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Выберите элементы для кастомизации вашего профиля:</h3>

                    <Tabs defaultActiveKey="1" className="mb-8">
                        {Object.entries(categories).map(([key, items]) => (
                            <TabPane tab={key} key={key}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {items
                                        .sort((a, b) => {
                                            const userLevel = userProfileStore.userProfile?.userLevel;
                                            const userLevelData = userLevels.find(lvl => lvl.level === userLevel?.level);
                                            const aLevelData = userLevels.find(lvl => lvl.level === a.minLevel);
                                            const bLevelData = userLevels.find(lvl => lvl.level === b.minLevel);

                                            // Проверка, если уровни не найдены, то предмет заблокирован
                                            const isAUnlocked = userLevelData && aLevelData ? userLevelData.min >= aLevelData.min : false;
                                            const isBUnlocked = userLevelData && bLevelData ? userLevelData.min >= bLevelData.min : false;

                                            // Разблокированные предметы идут первыми
                                            if (isAUnlocked && !isBUnlocked) return -1;
                                            if (!isAUnlocked && isBUnlocked) return 1;
                                            return 0; // Если оба или ни один не разблокирован, оставляем как есть
                                        })
                                        .map((item) => {
                                            const userLevel = userProfileStore.userProfile?.userLevel;
                                            const userLevelData = userLevels.find(lvl => lvl.level === userLevel?.level);
                                            const itemLevelData = userLevels.find(lvl => lvl.level === item.minLevel);

                                            // Проверка, если уровни не найдены, то предмет заблокирован
                                            const isUnlocked = userLevelData && itemLevelData
                                                ? userLevelData.min >= itemLevelData.min
                                                : false;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`relative group cursor-pointer rounded-lg overflow-hidden 
                  ${isUnlocked ? "hover:border-blue-500" : "opacity-50 cursor-not-allowed"} 
                  ${selectedItems[key] === item.id ? "border-2 border-blue-500 shadow-xl" : "border border-gray-200"}`}
                                                    onClick={() => isUnlocked && handleSelect(key, item.id)}
                                                >
                                                    {/* Tooltip для заблокированных элементов */}
                                                    <Tooltip title={!isUnlocked && `Требуется уровень: ${item.minLevel}`} placement="top">
                                                        <div className="relative z-10 p-4">
                                                            <h5 className="text-center font-medium text-gray-800">{item.name}</h5>
                                                            <p className="text-center text-green-500 font-semibold">{item.price} 💰</p>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            );
                                        })}
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </div>

                <Divider type="vertical"/>
                {/* Блок с выбранными элементами */}
                <div className="mt-8 w-2/5 ml-10">
                    <h3 className="text-xl font-semibold mb-4">Выбранные элементы:</h3>
                    <div className="flex flex-col flex-wrap gap-4">
                        {Object.entries(selectedItems).map(([category, itemId]) => {
                            // Проверка, если элемент выбран (не "none")
                            if (itemId && itemId !== "none") {
                                const item = categories[category]?.find(i => i.id === itemId);
                                // Если элемент существует, выводим его
                                if (item) {
                                    return (
                                        <div key={itemId} className="flex items-center bg-gray-100 p-2 rounded-full">
                                            <span>{item.name} ({item.price} 💰)</span>
                                            <Button
                                                type="link"
                                                className="ml-2 text-red-500"
                                                onClick={() => removeItem(category)}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    );
                                }
                            }
                            return null; // Если элемент не найден или не выбран
                        })}
                    </div>

                    {/* Кнопка для покупки всех выбранных элементов */}
                    {Object.values(selectedItems).some(itemId => itemId !== "none") && (
                        <Button
                            type="primary"
                            className="mt-6"
                            onClick={buyAll}
                        >
                            Купить все
                        </Button>
                    )}
                </div>
            </div>

            {/* Итоговая стоимость и кнопка */}
            <div className="mt-6 text-center">
                <h2 className="text-xl font-bold">
                    Итоговая стоимость: <span className="text-green-500">{totalCost} 💰</span>
                </h2>
                <Button type="primary" className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700">
                    Купить и применить
                </Button>
            </div>
        </div>
    );
});
