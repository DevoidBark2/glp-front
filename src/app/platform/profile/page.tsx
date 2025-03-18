"use client";
import { Spin, Tabs } from "antd";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive"

import { CourseUserProfile } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";
import { useMobxStores } from "@/shared/store/RootStore";
import { AddationalInfo, CustomizeProfile, UserAchievements } from "@/entities/user-profile";

const ProfilePage = () => {
    const { userProfileStore } = useMobxStores();
    const changeTabsPosition = useMediaQuery({ query: "(max-width: 1100px)" });

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => {
            userProfileStore.setLoading(false)
        });
    }, []);

    return (
        !userProfileStore.loading && userProfileStore.userProfile ? (
            <div className="container mx-auto mt-4">
                <Tabs
                    defaultActiveKey="1"
                    style={{ padding: "0 15px" }}
                    tabPosition={changeTabsPosition ? "top" : "left"}
                    items={[
                        {
                            key: '1',
                            label: <span className="dark:text-white">Профиль пользователя</span>,
                            children: <UserProfileBlock />,
                        },
                        {
                            key: '2',
                            label: <span className="dark:text-white">Курсы</span>,
                            children: <CourseUserProfile />,
                        },
                        {
                            key: '3',
                            label: <span className="dark:text-white">Дополнительная информация</span>,
                            children: <AddationalInfo />,
                        },
                        {
                            key: '4',
                            disabled: true,
                            label: <span className="dark:text-white">Кастомизация</span>,
                            children: <CustomizeProfile />,
                        },
                        {
                            key: '5',
                            disabled: true,
                            label: <span className="dark:text-white">Достижения</span>,
                            children: <UserAchievements />,
                        }
                    ]}
                />
            </div>
        ) : <div className="flex justify-center items-center custom-height-screen">
            <Spin size="large" />
        </div>
    );
};

export default observer(ProfilePage);
