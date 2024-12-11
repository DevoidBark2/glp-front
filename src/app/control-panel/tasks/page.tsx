"use client";
import React, { useEffect } from "react";
import { Table } from "antd";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import PageHeader from "@/components/PageHeader/PageHeader";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { taskColumns } from "@/columnsTables/taskColumns";
import { taskTable } from "@/shared/config";
import { useRouter } from "next/navigation";
import {CourseComponentTypeI} from "@/shared/api/course/model";

const TaskPage = () => {
    const { courseComponentStore } = useMobxStores()
    const router = useRouter();

    const handleChangeComponentTask = (record: CourseComponentTypeI) => {
        router.push(`tasks/${record.id}`)
    }

    useEffect(() => {
        courseComponentStore.getAllComponent();
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
                    handleDeleteComponent: courseComponentStore.deleteComponent
                })}
                locale={taskTable}
            />
        </PageContainerControlPanel>
    );
};

export default observer(TaskPage);
