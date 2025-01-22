import React from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Button, Progress, Spin } from "antd";
import { Header } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";

export const HeaderLesson = () => {
    const { courseStore } = useMobxStores()
    const router = useRouter()
    return (
        <Header className="flex items-center justify-between fixed w-full top-0 left-0 z-50 bg-[#001529] h-16">
            {courseStore.courseMenuLoading ? (
                <Spin />
            ) : (
                <h1 className="text-xl font-bold text-white">
                    {courseStore.courseMenuItems?.courseName}
                </h1>
            )}
            <div className="flex-1 mx-4">
                {
                    !courseStore.courseMenuLoading &&
                    <Progress
                        // success={{ percent: 90 }}
                        percent={courseStore.courseMenuItems?.progress}
                        strokeColor="green"
                        trailColor="#CCCCCC"
                        showInfo={true}
                        format={(percent) => <span className="text-white font-bold">{percent}%</span>}
                    />
                }
            </div>
            <Button
                onClick={() => router.push('/platform/courses')}
            >Вернутся на платформу</Button>
        </Header>
    )
}