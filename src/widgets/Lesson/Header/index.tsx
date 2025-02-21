import React from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export const HeaderLesson = () => {
    const { courseStore } = useMobxStores();
    const router = useRouter();

    return (
        <header className="relative w-full bg-white shadow-md">
            <div className="flex items-center justify-between w-full px-6 h-14">
                {courseStore.courseMenuLoading ? (
                    <Spin size="small" />
                ) : (
                    <h1 className="text-lg font-semibold text-gray-800">
                        {courseStore.courseMenuItems?.courseName || "Course"}
                    </h1>
                )}
                <HomeOutlined
                    className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition-colors"
                    onClick={() => router.push('/platform')}
                />
            </div>
        </header>
    );
};
