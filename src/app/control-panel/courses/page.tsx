"use client";
import React, { lazy } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";

import {PageContainerControlPanel} from "@/shared/ui";
import {PageHeader} from "@/shared/ui/PageHeader";
import { CourseControlList } from "@/entities/course/ui";
const SuccessfulCreateCourseModal = lazy(() => import('@/widgets').then(module => ({ default: module.SuccessfulCreateCourseModal })));
import {useMobxStores} from "@/shared/store/RootStore";

const CoursesPage = () => {
    const { courseStore } = useMobxStores()
    const router = useRouter();

    return (
        <>
            {courseStore.successCreateCourseModal &&
                <SuccessfulCreateCourseModal
                    openModal={courseStore.successCreateCourseModal}
                    onCancel={() => courseStore.setSuccessCreateCourseModal(false)}
                />
            }
            <PageContainerControlPanel>
                <PageHeader
                    title="Доступные курсы"
                    buttonTitle="Добавить курс"
                    onClickButton={() => router.push("courses/add")}
                    showBottomDivider
                />
                <CourseControlList/>
            </PageContainerControlPanel>
        </>
    );
}

export default observer(CoursesPage);
