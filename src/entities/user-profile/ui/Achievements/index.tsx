import { useState } from "react";
import { Modal, Button, Divider } from "antd"; // Импортируем компоненты из Ant Design
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";

// Перечисление уровней пользователя
export enum UserLevelEnum {
    Beginner = 'Beginner', // 0 - 100 points
    Novice = 'Novice', // 101 - 300 points
    Learner = 'Learner', // 301 - 600 points
    Skilled = 'Skilled', // 601 - 1000 points
    Advanced = 'Advanced', // 1001 - 1500 points
    Expert = 'Expert', // 1501 - 2100 points
    Master = 'Master', // 2101 - 2800 points
    Grandmaster = 'Grandmaster', // 2801 - 3600 points
    Legend = 'Legend', // 3601 - 4500 points
    Immortal = 'Immortal' // 4501+ points
}

// Функция для получения необходимого количества очков для каждого уровня
const getLevelPointsRequired = (level: UserLevelEnum) => {
    switch (level) {
        case UserLevelEnum.Beginner:
            return "0 - 100";
        case UserLevelEnum.Novice:
            return "101 - 300";
        case UserLevelEnum.Learner:
            return "301 - 600";
        case UserLevelEnum.Skilled:
            return "601 - 1000";
        case UserLevelEnum.Advanced:
            return "1001 - 1500";
        case UserLevelEnum.Expert:
            return "1501 - 2100";
        case UserLevelEnum.Master:
            return "2101 - 2800";
        case UserLevelEnum.Grandmaster:
            return "2801 - 3600";
        case UserLevelEnum.Legend:
            return "3601 - 4500";
        case UserLevelEnum.Immortal:
            return "4501+";
        default:
            return "";
    }
};

export const userLevels = [
    { level: "Beginner", min: 0, max: 100 },
    { level: "Novice", min: 101, max: 300 },
    { level: "Learner", min: 301, max: 600 },
    { level: "Skilled", min: 601, max: 1000 },
    { level: "Advanced", min: 1001, max: 1500 },
    { level: "Expert", min: 1501, max: 2100 },
    { level: "Master", min: 2101, max: 2800 },
    { level: "Grandmaster", min: 2801, max: 3600 },
    { level: "Legend", min: 3601, max: 4500 },
    { level: "Immortal", min: 4501, max: Infinity }
];



export const UserAchievements = observer(() => {
    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для отображения модального окна
    const totalRequired = 10; // Общее количество курсов для полного прогресса
    const getProgressPercentage = (current, total) => (current / total) * 100;
    const { achievementsStore, userProfileStore } = useMobxStores()

    const userPoints = userProfileStore.userProfile?.userLevel.points || 0;

    // const getUserLevel = (points) => {
    //     if (points <= 100) return UserLevelEnum.Beginner;
    //     if (points <= 300) return UserLevelEnum.Novice;
    //     if (points <= 600) return UserLevelEnum.Learner;
    //     if (points <= 1000) return UserLevelEnum.Skilled;
    //     if (points <= 1500) return UserLevelEnum.Advanced;
    //     if (points <= 2100) return UserLevelEnum.Expert;
    //     if (points <= 2800) return UserLevelEnum.Master;
    //     if (points <= 3600) return UserLevelEnum.Grandmaster;
    //     if (points <= 4500) return UserLevelEnum.Legend;
    //     return UserLevelEnum.Immortal;
    // };

    // Функция для отображения цвета прогресс-бара в зависимости от уровня
    const getProgressBarColor = (userLevel) => {
        switch (userLevel) {
            case UserLevelEnum.Beginner:
                return 'bg-red-500'; // Красный для новичков
            case UserLevelEnum.Novice:
                return 'bg-orange-500'; // Оранжевый для новичков
            case UserLevelEnum.Learner:
                return 'bg-yellow-500'; // Желтый для учащихся
            case UserLevelEnum.Skilled:
                return 'bg-green-500'; // Зеленый для опытных
            case UserLevelEnum.Advanced:
                return 'bg-teal-500'; // Бирюзовый для продвинутых
            case UserLevelEnum.Expert:
                return 'bg-blue-500'; // Синий для экспертов
            case UserLevelEnum.Master:
                return 'bg-indigo-500'; // Индиго для мастеров
            case UserLevelEnum.Grandmaster:
                return 'bg-purple-500'; // Пурпурный для грандмастеров
            case UserLevelEnum.Legend:
                return 'bg-pink-500'; // Розовый для легенд
            case UserLevelEnum.Immortal:
                return 'bg-black'; // Черный для бессмертных
            default:
                return 'bg-gray-500';
        }
    };



    const currentLevel = userLevels.find(l => userPoints >= l.min && userPoints <= l.max) || userLevels[0];
    const progress = ((userPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;

    // Функция для отображения модального окна с уровнями
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="p-4">
            <div className="flex justify-end">
                <Button
                    className="mb-6 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    onClick={showModal}
                >
                    Показать уровни
                </Button>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Общий прогресс</h3>
                <div className="relative w-full bg-gray-700 rounded-full h-6 mb-2 flex items-center">
                    <span className="absolute left-0 text-xs text-gray-300 ml-2">{currentLevel.min}</span>
                    <span className="absolute right-0 text-xs text-gray-300 mr-2">{currentLevel.max === Infinity ? '∞' : currentLevel.max}</span>
                    <div
                        className="bg-green-500 h-6 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-400">XP: {userPoints} / {currentLevel.max === Infinity ? '∞' : currentLevel.max}</p>
                <p className="text-sm mt-2">Ваш уровень: <span className="font-semibold text-blue-400">{currentLevel.level}</span></p>
            </div>
            <Divider />

            <h2 className="text-2xl font-bold mb-4">🎖️ Ваши достижения</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievementsStore.achievements.map((achieve, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center flex-col hover:shadow-lg transition-shadow duration-300 ease-in-out"
                    >
                        <span className="text-4xl mb-4">{achieve.icon}</span>
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-white">{achieve.title}</h3>
                            <p className="text-gray-400 mb-4">{achieve.description}</p>
                            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            getProgressPercentage(achieve.progress, achieve.targetValue),
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="text-sm text-gray-300 mt-2">
                                {achieve.progress} / {achieve.targetValue}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                title="Уровни и необходимые очки"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <div className="space-y-4">
                    {Object.values(UserLevelEnum).map((level) => (
                        <div key={level} className="flex justify-between items-center p-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300">
                            <h4 className="font-semibold text-lg">{level}</h4>
                            <p className="text-gray-400">{getLevelPointsRequired(level)}</p>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
});
