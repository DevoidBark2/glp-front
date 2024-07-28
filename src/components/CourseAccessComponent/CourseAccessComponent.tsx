import Image from "next/image";
import {AccessRightEnum} from "@/enums/AccessCourseEnum";

const CourseAccessComponent = ({access_level} : {access_level: number}) => {
    const renderLevelCourse = (access_level: number) => {
        switch (access_level) {
            case AccessRightEnum.PUBLIC:
                return (
                    <div className="flex items-center ml-2">
                        <Image src="/static/open_access_icon.svg" alt="Открытый доступ" width={50} height={50}/>
                        <p className="ml-2">Уровень доступа: <br/> Публичный</p>
                    </div>
                );
            case AccessRightEnum.PRIVATE:
                return (
                    <div className="flex items-center ml-2">
                        <Image src="/static/close_access_icon.svg" alt="Закрытый доступ" width={50} height={50}/>
                        <p className="ml-2">Уровень доступа: <br/> Приватный</p>
                    </div>
                );
        }
    }
    return renderLevelCourse(access_level);
}

export default CourseAccessComponent;