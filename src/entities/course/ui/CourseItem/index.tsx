import React from "react";
import nextConfig from "next.config.mjs";
import { observer } from "mobx-react";
import { Course } from "@/shared/api/course/model";
import Link from "next/link";

interface CourseItemProps {
    course: Course;
}

export const CourseItem = observer(({ course }: CourseItemProps) => {
    return (
        <Link
            href={`courses/${course.id}`}
            className="block rounded-lg shadow hover:shadow-lg bg-white overflow-hidden transition-transform duration-150 ease-out transform-gpu"
        >
            <div className="relative w-full h-48">
                <img
                    src={`${nextConfig.env!.API_URL}${course.image}`}
                    alt={course.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{course.name}</h3>
                <p className="text-sm text-gray-500 truncate">{`${course.user.first_name} ${course.user.second_name} ${course.user.last_name}`}</p>
            </div>
        </Link>
    );
});
