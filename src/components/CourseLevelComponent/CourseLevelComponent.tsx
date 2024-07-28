import {LevelCourseEnum} from "@/enums/LevelCourseEnum";
import Image from "next/image";

const CourseLevelComponent = ({level}: {level: number}) => {

    const renderLevelCourse = (level: number) => {
        switch (level) {
            case LevelCourseEnum.LIGHT:
                return (
                  <div className="flex items-center">
                      <Image src="/static/light_level_icon.svg" alt="Легкий уровень" width={50} height={50}/>
                      <p className="ml-2">Легкий уровень <br/> сложности</p>
                  </div>
                );
            case LevelCourseEnum.MIDDLE:
                return (
                    <div className="flex items-center">
                        <Image src="/static/middle_level_icon.svg" alt="Средний уровень" width={50} height={50}/>
                        <p className="ml-2">Средний уровень <br/> сложности</p>
                    </div>
                );
            case LevelCourseEnum.HARD:
                return (
                    <div className="flex items-center">
                        <Image src="/static/hard_level_icon.svg" alt="Сложный уровень" width={50} height={50}/>
                        <p className="ml-2">Сложный уровень <br/> сложности</p>
                    </div>
                );
        }
    }
    return renderLevelCourse(level);
};

export default CourseLevelComponent;