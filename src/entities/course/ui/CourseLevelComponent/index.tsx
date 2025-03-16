import React from "react";
import { TrophyOutlined } from "@ant-design/icons";

import { LevelCourseEnum } from "@/shared/api/course/model";

type CourseLevelComponentProps = {
    level: LevelCourseEnum;
};

export const CourseLevelComponent: React.FC<CourseLevelComponentProps> = ({ level }) => {
    const getLevelDescription = (level: LevelCourseEnum) => {
        switch (level) {
            case LevelCourseEnum.LIGHT:
                return "Легкий";
            case LevelCourseEnum.MIDDLE:
                return "Средний";
            case LevelCourseEnum.HARD:
                return "Сложный";
            default:
                return "Неизвестный уровень";
        }
    };

    return (
        <div className="flex items-center">
            <TrophyOutlined style={{ fontSize: 30, color: "#faad14" }} />
            <span className="ml-4 text-gray-700 text-base font-medium">
                Уровень: {getLevelDescription(level)}
            </span>
        </div>
    );
};