import { LevelCourseEnum } from "@/shared/api/course/model";
import Image from "next/image";
import React from "react";

type CourseLevelComponentProps = {
    level: LevelCourseEnum;
};

const CourseLevelComponent: React.FC<CourseLevelComponentProps> = ({ level }) => {
    const getLevelDetails = (level: LevelCourseEnum) => {
        switch (level) {
            case LevelCourseEnum.LIGHT:
                return {
                    icon: "/static/light_level_icon.svg",
                    altText: "Легкий уровень",
                    description: <>
                        Легкий уровень <br /> сложности
                    </>
                };
            case LevelCourseEnum.MIDDLE:
                return {
                    icon: "/static/middle_level_icon.svg",
                    altText: "Средний уровень",
                    description: <>
                        Средний уровень <br /> сложности
                    </>
                };
            case LevelCourseEnum.HARD:
                return {
                    icon: "/static/hard_level_icon.svg",
                    altText: "Сложный уровень",
                    description:<>
                        Сложный уровень <br /> сложности
                    </>
                };
        }
    };

    const { icon, altText, description } = getLevelDetails(level);

    return (
        <div className="flex items-center">
            <Image src={icon} alt={altText} width={50} height={50} />
            <p className="ml-2">{description}</p>
        </div>
    );
};

export default CourseLevelComponent;
