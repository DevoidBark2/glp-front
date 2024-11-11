"use client";
import { Modal,Spin } from "antd";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { CourseUserProfle } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";

const ProfilePage = () => {
    const { userStore, userProfileStore, feedBacksStore } = useMobxStores();

    useEffect(() => {
        userProfileStore.getUserProfile();
    }, []);

    return (
        !userProfileStore.loading ? (
            <div className="container mx-auto mb-4 mt-4">
                {/* Модальное окно для покидания курса */}
                <Modal
                    open={userStore.openLeaveCourseModal}
                    onCancel={() => userStore.setOpenLeaveCourseModal(false)}
                    title="Покинуть курс?"
                    okText="Да"
                    cancelText="Нет"
                >
                    Вы уверены, что хотите покинуть курс? Это действие нельзя отменить.
                </Modal>

                <PageHeader
                    title="Профиль пользователя"
                    showBottomDivider
                />

                <div className="flex gap-6 mt-2">
                    <UserProfileBlock/>
                    <CourseUserProfle/>
                </div>
            </div>
        ) : <div className="flex justify-center">
            <Spin size="large" />
        </div>
    );
};

export default observer(ProfilePage);
