import { UserLevelEnum } from "../users-level/model";

export type Icon = {
    id: number;
    name: string;
    price: number;
    minLevel: string;
    type: UserLevelEnum;
    isPurchased: boolean;
    isActive: boolean;
};

export type Effect = {
    id: number;
    name: string;
    price: number;
    minLevel: string;
    type: UserLevelEnum;
    isPurchased: boolean;
    isActive: boolean;
};

export type Frame = {
    id: number;
    name: string;
    className: string;
    price: number;
    minLevel: string;
    type: UserLevelEnum;
    isPurchased: boolean;
    isActive: boolean;
};

export type CustomizeCategoryItem = Icon | Effect | Frame;

export type Categories = {
    frames: Frame[];
    icons: Icon[];
    effects: Effect[];
};
