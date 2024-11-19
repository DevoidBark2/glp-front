import { Course } from "@/shared/api/course/model";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import dayjs from "dayjs";

export const courseMapper = (course: Course): Course => {
    return {
        id: course.id,
        name: course.name,
        image: course.image,
        category: course.category,
        access_right: course.access_right,
        level: course.level,
        small_description: course.small_description,
        content_description: course.content_description,
        duration: course.duration,
        status: course.status,
        publish_date: dayjs(course.publish_date, FORMAT_VIEW_DATE).toDate(),
        user: course.user,
        sections: course.sections,
        courseUsers: course.courseUsers
    };
}