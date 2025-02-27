import React from "react";
import { CustomizeItem } from "../CustomizeItem";
import { userLevels } from "@/entities/user-profile/ui/Achievements";
import { Categories, CustomizeCategoryItem, Effect, Frame, Icon } from "@/shared/api/customize/model";
import { useMobxStores } from "@/shared/store/RootStore";

interface ItemListProps {
    items: Array<Frame | Icon | Effect>;
    categoryKey: keyof Categories;
    selectedItems: Categories;
    handleSelect: (category: keyof Categories, item: CustomizeCategoryItem) => void;
    handleBuy: (category: keyof Categories, item: CustomizeCategoryItem) => void; // Добавим пропс для обработки покупки
}

export const CustomizeList: React.FC<ItemListProps> = ({
    items,
    categoryKey,
    selectedItems,
    handleSelect,
    handleBuy, // Получаем функцию для покупки
}) => {
    const { userProfileStore } = useMobxStores();
    const userLevel = userProfileStore.userProfile?.userLevel;
    const userLevelData = userLevels.find(lvl => lvl.level === userLevel?.level);

    const sortedItems = items
        .slice()
        .sort((a, b) => {
            const aLevelData = userLevels.find(lvl => lvl.level.toString() === a.minLevel);
            const bLevelData = userLevels.find(lvl => lvl.level.toString() === b.minLevel);

            const isAUnlocked = userLevelData && aLevelData ? userLevelData.min >= aLevelData.min : false;
            const isBUnlocked = userLevelData && bLevelData ? userLevelData.min >= bLevelData.min : false;

            if (isAUnlocked && !isBUnlocked) return -1;
            if (!isAUnlocked && isBUnlocked) return 1;
            return 0;
        });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedItems.map((item) => {
                const itemLevelData = userLevels.find(lvl => lvl.level.toString() === item.minLevel);
                const isUnlocked = userLevelData && itemLevelData ? userLevelData.min >= itemLevelData.min : false;
                const isSelected = selectedItems[categoryKey]?.some((selectedItem: CustomizeCategoryItem) => selectedItem.id === item.id);

                return (
                    <CustomizeItem
                        key={item.id}
                        item={item}
                        isUnlocked={isUnlocked}
                        isSelected={isSelected}
                        handleSelect={handleSelect}
                        handleBuy={handleBuy}
                        categoryKey={categoryKey}
                    />
                );
            })}
        </div>
    );
};
