"use client";
import { Divider, Spin } from "antd";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { CourseUserProfile } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";
import { useMobxStores } from "@/shared/store/RootStore";

const FrameNeonUnderline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative group flex items-center justify-center border-2 border-yellow-400 bg-yellow-900/10 shadow-[0_0_15px_#ffcc00] clip-cyber">
            {/* Добавляем псевдо-угол с бордером */}
            <div className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-gray-900 border-t-2 border-l-2 border-b-2 border-r-2 border-yellow-400 transform rotate-45 translate-x-1/2 translate-y-1/2"></div>

            <div className="text-yellow-300 text-lg font-bold">{children}</div>
        </div>
    );
};


const FrameTailwind = () => {
    return (
        <div className="relative w-[300px] h-[300px] bg-cyan-950">
            {/* Верхний левый скос с бордером */}
            <div className="absolute top-0 left-0 w-[40px] h-[40px] bg-cyan-950 border-t-2 border-l-2 border-cyan-400"></div>

            {/* Нижний правый скос с бордером */}
            <div className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-cyan-950 border-b-2 border-r-2 border-cyan-400"></div>
        </div>
    );
};

const ProfilePage = () => {
    const { userProfileStore } = useMobxStores();

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => {
            userProfileStore.setLoading(false)
        });
    }, []);

    return (
        !userProfileStore.loading ? (
            <div className="container mx-auto mt-4">
                <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 
                    relative tracking-wide text-center md:text-left transition-all duration-500 ease-in-out">
                    Профиль пользователя
                </h2>
                <Divider className="dark:bg-white" />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    width={300}
                    height={100}
                    style={{
                        shapeRendering: "geometricPrecision",
                        textRendering: "geometricPrecision",
                        imageRendering: "auto",
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                    }}
                    viewBox="0 0 2233 961"
                >
                    <path
                        d="m435 101-42 8-17-98 42-7 17 97zm426 400v-42h100v42H861zm-9 66 7-41 98 17-7 42-98-18zm-21 63 15-39 93 34-15 39-93-34zm-31 59 21-37 86 50-21 37-86-50zm-41 52 27-32 76 64-27 32-76-64zm-50 45 32-27 64 76-32 27-64-76zm-57 35 37-21 50 86-37 21-50-86zm-61 25 40-15 33 93-39 15-34-93zm-65 13 41-7 18 98-42 7-17-98zm-67 2h42v100h-42V861zm-66-9 42 7-17 98-42-7 17-98zm-63-21 40 15-34 93-40-15 34-93zm-58-31 36 21-50 86-36-21 50-86zm-53-41 33 27-64 76-33-27 64-76zm-44-50 27 32-76 64-27-32 76-64zm-35-57 21 37-86 50-21-37 86-50zm-25-61 15 39-94 34-14-39 93-34zm-14-65 8 41-98 18-7-42 97-17zm-2-67v42H0v-42h99zm10-66-8 42-97-17 7-42 98 17zm21-63-15 40-93-34 14-40 94 34zm31-58-21 36-86-50 21-36 86 50zm41-53-27 33-76-64 27-33 76 64zm50-44-33 27-64-76 33-27 64 76zm56-35-36 21-50-86 36-21 50 86zm62-25-40 15-34-94 40-14 34 93z"
                        style={{
                            fill: "#999",
                        }}
                    />
                    <path
                        d="M810 492c-15 0-27-12-28-27v-4c-1-15 10-29 26-30 15-1 28 11 29 26l1 5c0 16-11 29-27 30h-1zM438 181c-14 0-26-10-28-24-2-16 9-30 25-32h5c15-2 29 9 31 24 1 16-10 30-25 31l-4 1h-4zm-83 22c-11 0-21-7-26-17-6-15 1-31 15-37 4-1 7-2 10-4 14-5 30 2 36 17 5 14-2 30-16 36-3 1-6 2-8 3-4 1-8 2-11 2zm-74 42c-8 0-17-3-22-11-10-12-7-30 5-39 3-2 6-4 8-6 13-9 30-6 39 7 9 12 7 30-6 38-2 2-5 4-7 6-5 4-11 5-17 5zm-61 60c-6 0-12-2-17-6-12-9-14-27-5-39 2-3 5-5 7-8 10-12 27-14 39-4s14 28 4 40l-6 6c-5 7-13 11-22 11zm-43 73c-4 0-7 0-11-2-14-6-21-22-15-36 2-4 3-7 4-10 7-14 24-20 38-14 14 7 20 24 13 38-1 2-2 5-3 8-5 10-15 16-26 16zm-23 82h-4c-15-2-26-16-24-31 1-4 1-7 2-11 3-15 17-25 32-22 15 2 26 17 23 32-1 3-1 6-1 9-2 13-14 23-28 23zm-1 86c-14 0-27-11-28-25-1-4-1-7-1-10-2-16 10-29 25-31 16-1 29 11 30 26 1 3 1 6 1 9 2 15-9 29-24 30-1 1-2 1-3 1zm650 31c-2 0-4 0-6-1-15-3-24-18-21-33 0-3 1-6 1-8 3-16 18-26 33-23s25 17 22 32c0 4-1 7-2 11-2 13-14 22-27 22zm-630 51c-11 0-22-6-26-17-1-4-3-7-4-10-5-15 3-31 17-36 15-5 31 3 36 17 1 3 2 5 3 8 6 15-1 31-16 36-3 2-7 2-10 2zm602 29c-5 0-9-1-13-3-14-7-19-24-12-37 1-3 2-6 4-8 6-14 23-20 37-14 14 7 20 24 13 38-1 3-3 6-4 9-5 10-15 15-25 15zm-561 46c-9 0-17-4-23-12-2-2-4-5-6-8-8-13-5-30 8-39 12-9 30-5 38 7 2 3 4 5 6 7 9 13 6 30-7 39-4 4-10 6-16 6zm513 25c-7 0-14-3-19-8-11-10-12-28-2-39 2-2 4-4 6-7 10-11 27-13 39-3s13 28 3 39c-2 3-4 6-6 8-6 6-14 10-21 10zm-454 37c-6 0-13-2-18-7-3-2-5-4-8-6-12-10-13-28-3-40 10-11 28-13 40-3l6 6c12 10 14 27 4 39-5 7-13 11-21 11zm389 18c-9 0-17-4-23-12-8-13-5-30 8-39 2-1 5-3 7-5 13-9 30-6 39 7s6 30-7 39c-2 2-5 4-8 6-5 3-10 4-16 4zm-317 26c-4 0-7 0-11-2-3-2-7-3-10-5-14-6-19-23-12-37 6-14 23-20 37-13 2 1 5 3 8 4 14 6 20 23 14 37-5 10-15 16-26 16zm241 12c-12 0-23-8-26-19-5-15 2-31 17-36 3-1 6-2 8-2 15-6 31 2 36 16 5 15-2 31-16 36-4 1-7 2-10 3s-6 2-9 2zm-159 13c-2 0-3 0-5-1-3 0-6-1-10-1-15-3-25-18-22-33s18-25 33-22c3 0 5 1 8 1 16 3 26 17 23 32-2 14-14 24-27 24zm75 3c-14 0-26-11-27-26s10-28 26-29c3-1 5-1 8-1 16-2 29 10 31 25 1 15-10 29-25 31h-13z"
                        style={{
                            fill: "#666",
                        }}
                    />
                    <path
                        d="M501 0v151c135 9 247 97 290 219h1442V0H501z"
                        style={{
                            fill: "#ccc",
                        }}
                    />
                    <path
                        d="M628 480c0 82-66 148-148 148-81 0-147-66-147-148 0-81 66-147 147-147 82 0 148 66 148 147z"
                        style={{
                            fill: "#b3b3b3",
                        }}
                    />
                </svg>


                <FrameNeonUnderline>Профиль пользователя</FrameNeonUnderline>

                <FrameTailwind />
                <div className="flex flex-col lg:flex-row gap-6 mt-2 p-4 lg:p-6 text-neon-green">
                    <FrameNeonUnderline>
                        <UserProfileBlock />
                    </FrameNeonUnderline>

                    <CourseUserProfile />
                </div>
            </div>
        ) : <div className="flex justify-center items-center custom-height-screen">
            <Spin size="large" />
        </div>
    );
};

export default observer(ProfilePage);
