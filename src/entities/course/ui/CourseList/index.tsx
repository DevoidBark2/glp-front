import { Course } from "@/shared/api/course/model";
import { observer } from "mobx-react";
import { CourseItem } from "../CourseItem";

type CourseListProps = {
    courses: Course[];
};

export const CourseList = observer(({ courses }: CourseListProps) => {
    return (
        <div className="grid grid-cols-4 gap-6 mt-6">
            {courses?.map((course) => (
                <CourseItem key={course.id} course={course} />
            ))}
        </div>
    );
});