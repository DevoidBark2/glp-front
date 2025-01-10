"use client"
import {
    Breadcrumb,
    Divider,
} from "antd";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import {PageContainerControlPanel} from "@/shared/ui";
import {CourseAddComponent} from "@/entities/course/ui";

const CourseAddPage = () => {
    const { nomenclatureStore } = useMobxStores();


    useEffect(() => {
        nomenclatureStore.getCategories();
    }, [])

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/courses"}>Доступные курсы</Link>,
                    },
                    {
                        title: 'Новый курс',
                    },
                ]}
            />
            <div className="flex justify-center items-center">
                <h1 className="text-center text-3xl">Добавление курса</h1>
            </div>
            <Divider />
            <CourseAddComponent/>
        </PageContainerControlPanel>
    );
}

export default observer(CourseAddPage);