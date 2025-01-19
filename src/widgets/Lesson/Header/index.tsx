import { Button, Spin } from "antd";
import { Header } from "antd/es/layout/layout";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { FC } from "react";

interface HeaderLessonProps {
    courseStore: any
    router: AppRouterInstance
}

export const HeaderLesson: FC<HeaderLessonProps> = ({ courseStore, router }) => {
    return (
        <Header className="flex items-center justify-between fixed w-full top-0 left-0 z-50 bg-[#001529] h-16">
            {courseStore.courseMenuLoading ? (
                <Spin />
            ) : (
                <h1 className="text-xl font-bold text-white">
                    {courseStore.courseMenuItems?.courseName}
                </h1>
            )}
            <Button
                onClick={() => router.push('/platform/courses')}
            >Вернутся на платформу</Button>
            {/* <div className="flex-1 mx-4">
            {
                !courseStore.courseMenuLoading &&
                    <Progress
                        percent={20}
                        strokeColor="green"
                        trailColor="#CCCCCC"
                        showInfo={true}
                        format={(percent) => <span className="text-white font-bold">{percent}%</span>}
                    />
            }
        </div> */}
        </Header>
    )
}