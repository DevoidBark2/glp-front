import { CourseItem } from "../CourseItem";

export const CourseList = (courses: any) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {courses?.map(course => (
                <CourseItem course={course} />
            ))}
        </div>
    );
}