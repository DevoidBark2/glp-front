import { observer } from "mobx-react";
import { useState } from "react";
import { Divider, Tabs, Tooltip } from "antd";
import { useMobxStores } from "@/shared/store/RootStore";
import { Categories, CustomizeCategoryItem } from "@/shared/api/customize/model";
import { CustomizeList } from "@/entities/customize/ui";

const categoryLabels: { [key in keyof Categories]: string } = {
    frames: 'Рамки',
    icons: 'Иконки',
    effects: 'Эффекты',
};

export const CustomizeProfile = observer(() => {
    const { userProfileStore, customizeStore } = useMobxStores();
    const [selectedItems, setSelectedItems] = useState<Categories>({
        frames: [],
        icons: [],
        effects: [],
    });

    const handleSelect = (category: keyof Categories, item: CustomizeCategoryItem) => {
        debugger
        setSelectedItems(prev => {
            const newCart: Categories = { ...prev };

            if (!newCart[category].some(el => el.id === item.id)) {
                newCart[category] = [...newCart[category], item];
            } else {
                newCart[category] = newCart[category].filter(el => el.id !== item.id);
            }

            return newCart;
        });
    };

    const handleBuy = (category: keyof Categories, item: CustomizeCategoryItem) => {
        debugger
        // Логика покупки (например, списание монет)
        alert(`Вы купили ${item.name} из категории ${category}!`);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                🎨 Маркетплейс для кастомизации профиля
            </h1>
            <div className="flex justify-end items-center">
                <Tooltip title="Ваш баланс">
                    <div className="flex items-center gap-2 text-lg font-semibold text-yellow-600">
                        💰 {userProfileStore.userProfile?.coins}
                    </div>
                </Tooltip>
            </div>
            <Divider />
            <div className="flex justify-between p-4">
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-gray-700">
                        Выберите элементы для кастомизации вашего профиля:
                    </h3>

                    <Tabs
                        defaultActiveKey="frames"
                        className="mb-8"
                        items={Object.entries(customizeStore.categories).map(([key, items]) => ({
                            key: key,
                            label: categoryLabels[key as keyof Categories],
                            children: (
                                <CustomizeList
                                    items={items}
                                    categoryKey={key as keyof Categories}
                                    selectedItems={selectedItems}
                                    handleSelect={handleSelect}
                                    handleBuy={handleBuy}
                                />
                            ),
                        }))}
                    />
                </div>
            </div>
        </div >
    );
});
