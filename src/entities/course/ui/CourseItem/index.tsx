import React from "react";
import nextConfig from "next.config.mjs";
import { observer } from "mobx-react";
import { Course } from "@/shared/api/course/model";
import Link from "next/link";
import Image from "next/image";
import { BookOutlined } from "@ant-design/icons";

interface CourseItemProps {
    course: Course;
}

export const CourseItem = observer(({ course }: CourseItemProps) => {
    return (
        <Link
            href={`platform/courses/${course.id}`}
            className="block rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden"
        >
            <div className="relative w-full h-44 bg-gray-100">
                {course.image ? (
                    <Image
                        src={`${nextConfig.env!.API_URL}${course.image}`}
                        alt={course.name}
                        width={400}
                        height={176}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                        <BookOutlined className="text-5xl text-gray-400" />
                    </div>
                )}
            </div>

            {/* Контент */}
            <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.category.name}
                    </span>
                </p>
            </div>
        </Link>
    );
});
