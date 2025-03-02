"use client";
import { Spin, Tabs } from "antd";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { CourseUserProfile } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";
import { useMobxStores } from "@/shared/store/RootStore";
import { useMediaQuery } from "react-responsive"
import { AddationalInfo, CustomizeProfile, UserAchievements } from "@/entities/user-profile";

const ProfilePage = () => {
    const { userProfileStore, achievementsStore, customizeStore } = useMobxStores();
    const changeTabsPosition = useMediaQuery({ query: "(max-width: 1100px)" });

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => {
            userProfileStore.setLoading(false)
        });
        achievementsStore.getAllAchievement()
        customizeStore.getAllCategories()
    }, []);

    return (
        !userProfileStore.loading && userProfileStore.userProfile ? (
            <div className="container mx-auto mt-4">
                <Tabs
                    defaultActiveKey="2"
                    style={{ padding: "0 15px" }}
                    tabPosition={changeTabsPosition ? "top" : "left"}
                    items={[
                        {
                            key: '1',
                            label: <label className="dark:text-white">Профиль пользователя</label>,
                            children: <UserProfileBlock />,
                        },
                        {
                            key: '2',
                            label: <label className="dark:text-white">Кастомизация</label>,
                            children: <CustomizeProfile />,
                        },
                        {
                            key: '3',
                            label: <label className="dark:text-white">Курсы</label>,
                            children: <CourseUserProfile />,
                        },
                        {
                            key: '4',
                            label: <label className="dark:text-white">Дополнительная информация</label>,
                            children: <AddationalInfo />,
                        },
                        {
                            key: '5',
                            label: <label className="dark:text-white">Достижения</label>,
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
