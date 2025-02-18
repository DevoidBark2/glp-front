import React from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export const HeaderLesson = () => {
    const { courseStore } = useMobxStores();
    const router = useRouter();


    return (
        <div className="relative w-full">
            <div
                className="flex items-center justify-between w-full px-7 z-50 bg-gradient-to-r from-green-400 to-blue-500 h-16 shadow-lg backdrop-blur-md">
                {courseStore.courseMenuLoading ? (
                    <Spin/>
                ) : (
                    <h1 className="text-xl font-bold text-white">
                        {courseStore.courseMenuItems?.courseName}
                    </h1>
                )}

                <HomeOutlined
                    style={{color: "white"}}
                    className="text-white text-2xl cursor-pointer hover:text-gray-300 transition"
                    onClick={() => router.push('/platform')}
                />
            </div>
        </div>
    );
};
