import { welcomeTextRender } from "@/utils/welcomeText";
import { Skeleton, Tooltip } from "antd"
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { useEffect, useState } from "react";
import {SmileOutlined, CloudOutlined, MoonOutlined} from "@ant-design/icons";

export const WelcomeTextComponent = () => {
    const [currentDate, setCurrentDate] = useState<string | null>(null);
    
    const renderIcon = () => {
        const currentHours = dayjs().hour();
        if (currentHours >= 6 && currentHours < 12) {
          return <SmileOutlined className="text-yellow-400 text-4xl" />; // Утро
        } else if (currentHours >= 12 && currentHours < 18) {
          return <CloudOutlined className="text-orange-400 text-4xl" />; // День
        }else if (currentHours >= 18 && currentHours < 21) {
          return <CloudOutlined className="text-orange-400 text-4xl" />; // Вечер
        } else {
          return <MoonOutlined className="text-blue-400 text-4xl" />; // Ночь
        }
      };

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentDate(dayjs().locale('ru').format('DD MMMM YYYY, HH:mm:ss'));
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);
      
    return (
        <div className="flex items-center justify-center p-6 bg-gradient-to-r from-green-300 via-blue-300 to-purple-400 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <Tooltip title="Текущее время суток">{renderIcon()}</Tooltip>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-white">{welcomeTextRender()}</p>
              {currentDate ? (
                <p className="text-lg text-gray-100">{currentDate}</p>
              ) : <Skeleton.Input size="small" />}
            </div>
          </div>
        </div>
    )
}