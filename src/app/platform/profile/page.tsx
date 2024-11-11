"use client";
import { Spin } from "antd";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { CourseUserProfle } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";

const ProfilePage = () => {
    const { userProfileStore } = useMobxStores();

    useEffect(() => {
        userProfileStore.getUserProfile();
    }, []);

    return (
        !userProfileStore.loading ? (
            <div className="container mx-auto mb-4 mt-4">
                <PageHeader
                    title="Профиль пользователя"
                    showBottomDivider
                />

                <div className="flex gap-6 mt-2">
                    <UserProfileBlock/>
                    <CourseUserProfle/>
                </div>
            </div>
        ) : <div className="flex justify-center items-center custom-height-screen">
            <Spin size="large" />
        </div>
    );
};

export default observer(ProfilePage);
