import React, { useState } from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Progress, Spin, Drawer, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

export const HeaderLesson = () => {
    const { courseStore } = useMobxStores();
    const router = useRouter();

    // Хук для медиазапроса, чтобы скрывать элементы на экранах меньше 768px
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const [drawerVisible, setDrawerVisible] = useState(false);

    // Функция для открытия/закрытия Drawer
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <div className="relative w-full">
            {/* Header для экранов больше 768px */}
            {!isMobile && (
                <div className="flex items-center justify-between w-full z-50 bg-gradient-to-r from-green-400 to-blue-500 h-16 shadow-lg backdrop-blur-md">
                    {courseStore.courseMenuLoading ? (
                        <Spin />
                    ) : (
                        <h1 className="text-xl font-bold text-white">
                            {courseStore.courseMenuItems?.courseName}
                        </h1>
                    )}
                    <div className="flex-1 mx-4">
                        {!courseStore.courseMenuLoading && (
                            <Progress
                                percent={courseStore.courseMenuItems?.progress}
                                strokeColor="green"
                                trailColor="#CCCCCC"
                                showInfo={true}
                                format={(percent) => (
                                    <span className="text-white font-bold">{percent}%</span>
                                )}
                            />
                        )}
                    </div>
                    <HomeOutlined
                        style={{ color: "white" }}
                        className="text-white text-2xl cursor-pointer hover:text-gray-300 transition"
                        onClick={() => router.push('/platform')}
                    />
                </div>
            )}

            {/* Мобильная версия с кнопкой "Раскрыть" */}
            {isMobile && (
                <>
                    <Button
                        type="primary"
                        onClick={toggleDrawer}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                    >
                        Раскрыть
                    </Button>
                    <Drawer
                        title="Course Menu"
                        placement="top"
                        closable={true}
                        onClose={toggleDrawer}
                        open={drawerVisible}
                        height="auto"
                    >
                        <div className="flex flex-col items-center">
                            {courseStore.courseMenuLoading ? (
                                <Spin />
                            ) : (
                                <h1 className="text-xl font-bold text-black">
                                    {courseStore.courseMenuItems?.courseName}
                                </h1>
                            )}
                            <div className="my-4 w-full">
                                {!courseStore.courseMenuLoading && (
                                    <Progress
                                        percent={courseStore.courseMenuItems?.progress}
                                        strokeColor="green"
                                        trailColor="#CCCCCC"
                                        showInfo={true}
                                        format={(percent) => (
                                            <span className="text-black font-bold">{percent}%</span>
                                        )}
                                    />
                                )}
                            </div>
                            <Button
                                type="link"
                                onClick={() => router.push('/platform')}
                                className="text-blue-500"
                            >
                                Перейти на платформу
                            </Button>
                        </div>
                    </Drawer>
                </>
            )}
        </div>
    );
};
