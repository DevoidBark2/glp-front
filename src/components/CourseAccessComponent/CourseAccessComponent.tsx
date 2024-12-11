import { AccessRightEnum } from "@/shared/api/course/model";
import Image from "next/image";
import React from "react";

type CourseAccessComponentProps = {
    access_level: AccessRightEnum;
};

// eslint-disable-next-line react/display-name
const CourseAccessComponent: React.FC<CourseAccessComponentProps> = React.memo(({ access_level }) => {
    const getAccessDetails = (access_level: AccessRightEnum) => {
        switch (access_level) {
            case AccessRightEnum.PUBLIC:
                return {
                    icon: "/static/open_access_icon.svg",
                    altText: "Открытый доступ",
                    description: "Публичный"
                };
            case AccessRightEnum.PRIVATE:
                return {
                    icon: "/static/close_access_icon.svg",
                    altText: "Закрытый доступ",
                    description: "Приватный"
                };
        }
    };

    const { icon, altText, description } = getAccessDetails(access_level);

    return (
        <div className="flex items-center ml-2">
            <Image src={icon} alt={altText} width={50} height={50} />
            <p className="ml-2">Уровень доступа: <br /> {description}</p>
        </div>
    );
});

export default CourseAccessComponent;
