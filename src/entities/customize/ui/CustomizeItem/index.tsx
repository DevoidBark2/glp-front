import { Button, Tooltip } from "antd";
import React from "react";

import { Categories, CustomizeCategoryItem, Effect, Frame, Icon } from "@/shared/api/customize/model";

interface CustomizeItemProps {
    item: Frame | Icon | Effect;
    isUnlocked: boolean;
    isSelected: boolean;
    handleSelect: (category: keyof Categories, item: CustomizeCategoryItem) => void;
    handleBuy: (category: keyof Categories, item: CustomizeCategoryItem) => void;
    categoryKey: keyof Categories;
}

export const CustomizeItem: React.FC<CustomizeItemProps> = ({
    item,
    isUnlocked,
    isSelected,
    handleSelect,
    handleBuy,
    categoryKey
}) => (
        <Tooltip title={!isUnlocked ? `Требуется уровень: ${item.minLevel}` : ""} placement="top">
            <div
                className={`relative flex flex-col items-center p-6 rounded-lg shadow-lg border transition-all
                    ${isUnlocked ? "hover:border-blue-500" : "opacity-50 cursor-not-allowed"}
                    ${isSelected || item.isActive ? "border-2 border-blue-500 shadow-2xl" : "border-gray-300"}
                    bg-white h-48`}
            >
                <div className="w-full text-center">
                    <h5 className="text-lg font-semibold text-gray-800">{item.name}</h5>
                    <p className="text-lg text-green-500 font-bold">{item.price} 💰</p>
                </div>

                <div className="mt-auto w-full flex gap-2 justify-center">
                    {
                        !item.isPurchased && <Button
                            color="default"
                            variant="solid"
                            disabled={!isUnlocked}
                            onClick={() => handleBuy(categoryKey, item)}
                        >
                            Купить
                        </Button>
                    }
                    <Button
                        color={item.isActive ? "danger" : "default"}
                        variant={item.isActive ? "solid" : "outlined"}
                        disabled={!isUnlocked || (!item.isPurchased && !item.isActive)}
                        onClick={() => handleSelect(categoryKey, item)}
                    >
                        {item.isActive ? "Отключить" : "Применить"}
                    </Button>
                </div>
            </div>
        </Tooltip>
    );
