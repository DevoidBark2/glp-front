import React from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import Image from "next/image";
import { BookOutlined } from "@ant-design/icons";

import { Course } from "@/shared/api/course/model";
import nextConfig from "next.config.mjs";

interface CourseItemProps {
    course: Course;
}

export const CourseItem = observer(({ course }: CourseItemProps) => (
        <Link
            href={`platform/courses/${course.id}`}
            className="block rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-[#252525] overflow-hidden"
        >
            <div className="relative w-full h-44 bg-gray-100">
                {course.image ? (
                    <Image
                        src={`${nextConfig.env!.API_URL}${course.image}`}
                        alt={course.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        priority
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
                        <BookOutlined className="text-5xl text-gray-400" />
                    </div>
                )}
            </div>

            <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 dark:text-white">{course.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 px-3 py-1 rounded-full text-xs font-medium dark:text-white">
                        {course.category.name}
                    </span>
                </p>
            </div>
        </Link>
    ));
