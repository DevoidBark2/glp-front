"use client";
import React, {useEffect, useState} from "react";
import { Table } from "antd";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import {PageHeader} from "@/shared/ui/PageHeader";
import {PageContainerControlPanel} from "@/shared/ui";
import { taskColumns } from "@/columnsTables/taskColumns";
import { taskTable } from "@/shared/config";
import { useRouter } from "next/navigation";
import {CourseComponentTypeI} from "@/shared/api/course/model";
import {SettingControlPanel} from "@/shared/model";

const TaskPage = () => {
    const { courseComponentStore, userProfileStore } = useMobxStores()
    const router = useRouter();
    const [settings, setSettings] = useState<SettingControlPanel | null>(null);

    const handleChangeComponentTask = (record: CourseComponentTypeI) => {
        router.push(`tasks/${record.id}`)
    }

    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
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
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                rowKey={(record) => record.id}
                loading={courseComponentStore.loadingCourseComponent}
                dataSource={courseComponentStore.courseComponents}
                columns={taskColumns({
                    handleChangeComponent: handleChangeComponentTask,
                    handleDeleteComponent: courseComponentStore.deleteComponent,
                    currentUser: userProfileStore.userProfile
                })}
                locale={taskTable}
            />
        </PageContainerControlPanel>
    );
};

export default observer(TaskPage);
