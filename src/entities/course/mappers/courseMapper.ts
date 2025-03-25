import dayjs from "dayjs";

import { Course, CourseMember } from "@/shared/api/course/model";

export const courseMapper = (course: Course): any => ({
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
        created_at: dayjs(course.created_at).toDate(),
        user: course.user,
        sections: course.sections,
        courseUsers: course.courseUsers
    })

export const courseMemberMapper = (courseMember: CourseMember): CourseMember => ({
        id: courseMember.id,
        enrolledAt: courseMember.enrolledAt,
        progress: courseMember.progress,
        user: courseMember.user
    })