import { observer } from "mobx-react";
import React, { useState } from "react";
import { Divider, Tabs, Tooltip } from "antd";

import { useMobxStores } from "@/shared/store/RootStore";
import { Categories, CustomizeCategoryItem } from "@/shared/api/customize/model";
import { CustomizeList } from "@/entities/customize/ui";

const categoryLabels = {
    frames: 'Рамки',
    icons: 'Иконки',
    effects: 'Эффекты',
};

export const CustomizeProfile = observer(() => {
    const { userProfileStore, customizeStore } = useMobxStores();
    const [selectedItems] = useState<Categories>({
        frames: [],
        icons: [],
        effects: [],
    });

    const handleSelect = (category: keyof Categories, item: CustomizeCategoryItem) => {
        customizeStore.selectItem(category, item);
    };


    const handleBuy = (category: keyof Categories, item: CustomizeCategoryItem) => {
        // customizeStore.buyItem(category, item).then(response => {
        //     if (userProfileStore.userProfile) {
        //         userProfileStore.setUserProfile({
        //             ...userProfileStore.userProfile,
        //             coins: response.balance
        //         });
        //     }
        //     notification.success({ message: response.message })
        // }).catch(e => {
        //     notification.error({ message: e.response.data.message });
        // });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                🎨 Маркетплейс для персонализации профиля
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
