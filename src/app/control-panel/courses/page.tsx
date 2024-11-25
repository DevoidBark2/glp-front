"use client";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import SuccessfulCreateCourseModal from "@/components/SuccessfulCreateCourseModal/SuccessfulCreateCourseModal";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import PageHeader from "@/components/PageHeader/PageHeader";
import { CourseControlList } from "@/entities/course/ui";

const CoursesPage = () => {
    const { courseStore } = useMobxStores()
    const router = useRouter();

    useEffect(() => {
        return () => {
            courseStore.setSuccessCreateCourseModal(false)
        }
    }, []);

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
