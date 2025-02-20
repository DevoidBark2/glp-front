"use client";
import { Spin, Tabs } from "antd";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { CourseUserProfile } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";
import { useMobxStores } from "@/shared/store/RootStore";
import { useMediaQuery } from "react-responsive"
import { AddationalInfo } from "@/entities/user-profile";

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
                    animated
                    style={{ padding: "0 15px" }}
                    tabPosition={changeTabsPosition ? "top" : "left"}
                    items={[
                        {
                            key: '1',
                            label: 'Профиль пользователя',
                            children: <UserProfileBlock />,
                        },
                        {
                            key: '2',
                            label: 'Курсы',
                            children: <CourseUserProfile />,
                        },
                        {
                            key: '3',
                            label: 'Дополнительная информация',
                            children: <AddationalInfo />,
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
