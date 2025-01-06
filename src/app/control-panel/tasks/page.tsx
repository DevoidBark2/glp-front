"use client";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import {PageHeader} from "@/shared/ui/PageHeader";
import {PageContainerControlPanel} from "@/shared/ui";
import { taskColumns } from "@/columnsTables/taskColumns";
import { taskTable } from "@/shared/config";
import { useRouter } from "next/navigation";
import {CourseComponentTypeI} from "@/shared/api/course/model";
import { UserType } from "@/widgets";

const TaskPage = () => {
    const { courseComponentStore, userProfileStore } = useMobxStores()
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    const handleChangeComponentTask = (record: CourseComponentTypeI) => {
        router.push(`tasks/${record.id}`)
    }

    useEffect(() => {
        courseComponentStore.getAllComponent();
        userProfileStore.getUserProfile().then(response => {
            setCurrentUser(response)
        })
    }, []);

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Доступные компоненты"
                buttonTitle="Добавить компонент"
                onClickButton={() => router.push('tasks/add')}
                showBottomDivider
            />
            <Table
                rowKey={(record) => record.id}
                loading={courseComponentStore.loadingCourseComponent}
                dataSource={courseComponentStore.courseComponents}
                columns={taskColumns({
                    handleChangeComponent: handleChangeComponentTask,
                    handleDeleteComponent: courseComponentStore.deleteComponent,
                    currentUser: currentUser
                })}
                locale={taskTable}
            />
        </PageContainerControlPanel>
    );
};

export default observer(TaskPage);
