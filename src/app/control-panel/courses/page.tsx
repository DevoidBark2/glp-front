"use client";
import { observer } from "mobx-react";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import { coursesTable, paginationCount } from "@/tableConfig/coursesTable";
import SuccessfulCreateCourseModal from "@/components/SuccessfulCreateCourseModal/SuccessfulCreateCourseModal";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getCourseColumns } from "@/columnsTables/courseColumns";
import { getCookieUserDetails } from "@/lib/users";

const CoursesPage = () => {
    const { courseStore } = useMobxStores()
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);

    const publishCourse = (id: number) => courseStore.publishCourse(id)

    const forwardCourse = (id: number) => router.push(`courses/${id}`)

    const deleteCourse = (id: number) => courseStore.deleteCourse(id)


    useEffect(() => {
        courseStore.getCoursesForCreator()

        const currentUser = getCookieUserDetails();

        setCurrentUser(currentUser);

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
                <Table
                    rowKey={(record) => record.id}
                    loading={courseStore.loadingCourses}
                    dataSource={courseStore.userCourses}
                    columns={getCourseColumns({ publishCourse, forwardCourse, deleteCourse, currentUser })}
                    pagination={{ pageSize: paginationCount }}
                    locale={coursesTable}
                    bordered
                />
            </PageContainerControlPanel>
        </>
    );
}

export default observer(CoursesPage);
