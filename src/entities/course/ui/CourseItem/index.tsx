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
            className="block rounded-lg shadow hover:shadow-lg hover:cursor-pointer bg-white overflow-hidden transition-transform duration-150 ease-out transform-gpu"
        >
            <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {course.image ? (
                    <Image
                        src={`${nextConfig.env!.API_URL}${course.image}`}
                        alt={course.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <BookOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{course.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.category.name}
                    </span>
                </p>
            </div>
        </Link>
    );
});
