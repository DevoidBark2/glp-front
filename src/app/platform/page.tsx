"use client"
import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import { observer } from "mobx-react";

import { useMobxStores } from '@/shared/store/RootStore';
import { CourseList } from "@/entities/course/ui";

const PlatformPage = () => {
    const { courseStore } = useMobxStores()
    const [noResultsFound, setNoResultsFound] = useState(false);

    useEffect(() => {
        if (courseStore.courses.length === 0) {
            setNoResultsFound(true);
        } else {
            setNoResultsFound(false);
        }
    }, [courseStore.courses]);



    useEffect(() => {
        courseStore.getAllCourses();
    }, []);

    return <div className="container mx-auto max-lg:px-4 px-2">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6">
            <h1 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left dark:text-white">
                Доступные курсы
            </h1>
        </div>

        <Divider className="my-6" />

        {noResultsFound && (
            <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Курсы не найдены</h3>
                <p className="text-gray-600">Извините, по вашему запросу курсы не найдены. Пожалуйста, попробуйте другой
                    запрос.</p>
            </div>
        )}

        <CourseList courses={courseStore.courses} loading={courseStore.loadingCourses} notFound={noResultsFound} />
    </div >
}

export default observer(PlatformPage);