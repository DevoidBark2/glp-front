"use client";
import { Divider, Spin} from "antd";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { CourseUserProfile } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";
import {useMobxStores} from "@/shared/store/RootStore";

const ProfilePage = () => {
    const { userProfileStore } = useMobxStores();

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => {
            userProfileStore.setLoading(false)
        });
    }, []);

    return (
        !userProfileStore.loading ? (
            <div className="container mx-auto">
                <h1 className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Профиль пользователя</h1>
                <Divider />

                <div className="flex gap-6 mt-2">
                    <UserProfileBlock/>
                    <CourseUserProfile/>
                </div>
            </div>
        ) : <div className="flex justify-center items-center custom-height-screen">
            <Spin size="large" />
        </div>
    );
};

export default observer(ProfilePage);
