import React, { useState } from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Spin, Modal, Button } from "antd";
import { HomeOutlined, AppstoreOutlined } from "@ant-design/icons";
import { ThunderboltOutlined, TrophyOutlined, TeamOutlined, FireOutlined, RocketOutlined, SmileOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export const HeaderLesson = () => {
    const { courseStore } = useMobxStores();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const gameModes = [
        { name: "Спидран", icon: <RocketOutlined className="text-orange-500 text-xl" /> },
        { name: "Выживание", icon: <FireOutlined className="text-green-500 text-xl" /> },
        { name: "Хардкор", icon: <ThunderboltOutlined className="text-red-600 text-xl" /> },
        { name: "Марафон", icon: <TrophyOutlined className="text-yellow-500 text-xl" /> },
        { name: "Кооператив", icon: <TeamOutlined className="text-blue-500 text-xl" /> },
        { name: "Дзен", icon: <SmileOutlined className="text-purple-500 text-xl" /> },
    ];

    return (
        <header className="relative w-full bg-white shadow-md dark:bg-[#1a1a1a]">
            <div className="flex items-center justify-between w-full px-6 h-14">
                {courseStore.courseMenuLoading && !courseStore.courseMenuItems?.courseName ? (
                    <Spin size="small" />
                ) : (
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {courseStore.courseMenuItems?.courseName}
                    </h1>
                )}
                <div className="flex gap-4">
                    <AppstoreOutlined
                        className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition-colors dark:text-white"
                        onClick={() => setIsModalOpen(true)}
                    />
                    <HomeOutlined
                        className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition-colors dark:text-white"
                        onClick={() => router.push('/platform')}
                    />
                </div>
            </div>

            <Modal
                title="Выбери свой режим!"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                className="dark:bg-[#1a1a1a] dark:text-white p-6"
            >
                <div className="grid grid-cols-2 gap-4">
                    {gameModes.map((mode, index) => (
                        <Button
                            key={mode.name}
                            onClick={() => setIsModalOpen(false)}
                            className="flex items-center justify-center gap-3 p-4 font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-lg shadow-md"
                        >
                            {mode.icon}
                            {mode.name}
                        </Button>
                    ))}
                </div>
            </Modal>
        </header>
    );
};
