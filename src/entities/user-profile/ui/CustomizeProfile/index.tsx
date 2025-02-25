import { observer } from "mobx-react";
import { useState } from "react";
import { Button, Divider, Tabs, Tooltip } from "antd";
import { useMobxStores } from "@/shared/store/RootStore";

const { TabPane } = Tabs;

const categories = {
    frames: [
        { id: "gold", name: "Золото", className: "border-yellow-400", price: 500 },
        { id: "silver", name: "Серебро", className: "border-gray-400", price: 300 },
        { id: "none", name: "Без рамки", className: "", price: 0 },
    ],
    backgrounds: [
        { id: "blue", name: "Синий", className: "bg-blue-500", price: 400 },
        { id: "red", name: "Красный", className: "bg-red-500", price: 400 },
        { id: "green", name: "Зеленый", className: "bg-green-500", price: 400 },
        { id: "purple", name: "Пурпурный", className: "bg-purple-500", price: 400 },
        { id: "none", name: "Без фона", className: "", price: 0 },
    ],
    icons: [
        { id: "star", name: "⭐ Звезда", price: 200 },
        { id: "heart", name: "❤️ Сердце", price: 250 },
        { id: "rocket", name: "🚀 Ракета", price: 350 },
        { id: "crown", name: "👑 Корона", price: 500 },
    ],
    effects: [
        { id: "glow", name: "✨ Свечение", price: 300 },
        { id: "shadow", name: "🌑 Тень", price: 200 },
        { id: "sparkle", name: "🌟 Искры", price: 150 },
        { id: "rainbow", name: "🌈 Радуга", price: 450 },
    ],
    borders: [
        { id: "dashed", name: "Пунктирная линия", className: "border-dashed", price: 100 },
        { id: "solid", name: "Сплошная линия", className: "border-solid", price: 150 },
        { id: "double", name: "Двойная линия", className: "border-double", price: 200 },
    ],
    fontStyles: [
        { id: "handwriting", name: "Рукописный", className: "font-cursive", price: 250 },
        { id: "monospace", name: "Моноширинный", className: "font-mono", price: 200 },
        { id: "serif", name: "Сериф", className: "font-serif", price: 150 },
    ],
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
            <div className="flex justify-between items-center">
                <Button onClick={() => setPreviewModal(true)}>Предпросмотр</Button>
                <Tooltip title="Ваш баланс">
                    <div className="flex items-center gap-2 text-lg font-semibold text-yellow-600">
                        💰 {userProfileStore.userProfile?.coins}
                    </div>
                </Tooltip>
            </div>
            <Divider />
            <div className="p-8">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-600">🎨 Маркетплейс для кастомизации профиля</h1>
                <h3 className="text-xl font-semibold mb-6 text-gray-700">Выберите элементы для кастомизации вашего профиля:</h3>

                {/* Вкладки для категорий */}
                <Tabs defaultActiveKey="1" className="mb-8">
                    {Object.entries(categories).map(([key, items]) => (
                        <TabPane tab={key} key={key}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 ${selectedItems[key] === item.id ? "border-2 border-blue-500 shadow-xl" : "border border-gray-200"}`}
                                        onClick={() => handleSelect(key, item.id)}
                                    >
                                        <div className="absolute inset-0 bg-black opacity-25 group-hover:opacity-0 transition-opacity"></div>
                                        <div className="relative z-10 p-4">
                                            <h5 className="text-center font-medium text-gray-800">{item.name}</h5>
                                            <p className="text-center text-green-500 font-semibold">{item.price} 💰</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabPane>
                    ))}
                </Tabs>

                {/* Блок с выбранными элементами */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Выбранные элементы:</h3>
                    <div className="flex flex-wrap gap-4">
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
                    💰 Итоговая стоимость: <span className="text-green-500">{totalCost} монет</span>
                </h2>
                <Button type="primary" className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-700">
                    Купить и применить
                </Button>
            </div>
        </div>
    );
});
