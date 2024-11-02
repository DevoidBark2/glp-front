"use client";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect } from "react";
import { Divider, Spin } from "antd";
import { CourseList } from "@/entities/course/ui/CourseList";

const CoursesPage = () => {
    const { courseStore } = useMobxStores();

    useEffect(() => {
        courseStore.getAllCourses();
    }, []);

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Доступные курсы</h1>
                </div>
            </div>
            <Divider className="my-6" />
           {
                !courseStore.loadingCourses ? (
                    <CourseList courses={courseStore.courses}/>
                ) : (
                    <div className="flex justify-center items-center h-60">
                        <Spin size="large" />
                    </div>
                )
            }
        </div>
    );
}

export default observer(CoursesPage);
