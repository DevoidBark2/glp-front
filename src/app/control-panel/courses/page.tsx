"use client";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import {PageContainerControlPanel} from "@/shared/ui";
import {PageHeader} from "@/shared/ui/PageHeader";
import { CourseControlList } from "@/entities/course/ui";
import {SuccessfulCreateCourseModal} from "@/widgets";

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
