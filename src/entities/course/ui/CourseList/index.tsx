import { Course } from "@/shared/api/course/model";
import { observer } from "mobx-react";
import { CourseItem } from "../CourseItem";
import { Skeleton } from "antd";
import React from "react";

type CourseListProps = {
    courses: Course[];
    loading: boolean;
    notFound: boolean
};

export const CourseList = observer(({ courses,loading,notFound }: CourseListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-4">
            {!loading && courses.length < 1 && !notFound
                ? Array.from({length: 8}).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow">
                        <div className="flex-shrink-0 w-full h-48 mr-4 bg-gray-200 rounded-lg overflow-hidden"></div>
                        <div className="p-4">
                            <Skeleton active paragraph={{rows: 1, width: "80%"}} title={true}/>
                        </div>
                    </div>
                ))
                : courses?.map((course) => (
                    <CourseItem key={course.id} course={course}/>
                ))}
        </div>
    );
});
