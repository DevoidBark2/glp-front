import { Categories, CustomizeCategoryItem } from "@/shared/api/customize/model";
import { Button, Tooltip } from "antd";

interface CustomizeItemProps {
    item: any;
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
}) => {
    return (
        <Tooltip title={!isUnlocked ? `Требуется уровень: ${item.minLevel}` : ""} placement="top">
            <div
                className={`relative flex flex-col items-center p-6 rounded-lg shadow-lg border transition-all
                    ${isUnlocked ? "hover:border-blue-500" : "opacity-50 cursor-not-allowed"}
                    ${isSelected ? "border-2 border-blue-500 shadow-2xl" : "border-gray-300"}
                    bg-white h-48`}
            >
                <div className="w-full text-center">
                    <h5 className="text-lg font-semibold text-gray-800">{item.name}</h5>
                    <p className="text-lg text-green-500 font-bold">{item.price} 💰</p>
                </div>

                <div className="mt-auto w-full flex gap-2 justify-center">
                    <Button
                        color="default"
                        variant="solid"
                        disabled={!isUnlocked}
                        onClick={() => handleBuy(categoryKey, item)} // Обработка кнопки "Купить"
                    >
                        Купить
                    </Button>
                    <Button
                        color="default"
                        variant="outlined"
                        disabled={!isUnlocked}
                        onClick={() => handleSelect(categoryKey, item)}
                    >
                        Применить
                    </Button>
                </div>
            </div>
        </Tooltip>
    );
};
