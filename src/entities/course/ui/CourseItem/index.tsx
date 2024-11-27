import nextConfig from "next.config.mjs";
import { useMobxStores } from "@/shared/store/RootStore";
import { Course } from "@/shared/api/course/model";
import { observer } from "mobx-react";
import CourseDetails from "@/features/enrollCourse/ui/CourseDetails";

type CourseItemProps = {
    course: Course
}

export const CourseItem = observer(({ course }: CourseItemProps) => {
    const { courseStore } = useMobxStores();
    return (
        <>
            <CourseDetails
                course={courseStore.selectedCourseForDetailModal!}
                openModal={courseStore.openCourseDetailsModal}
                setOpenModal={courseStore.setOpenCourseDetailsModal}
            />
            <div
                onClick={() => courseStore.setSelectedCourseForDetailModal(course)}
                className="relative flex flex-col justify-between rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform-gpu"
            >
                <div className="relative group">
                    <img
                        src={`${nextConfig.env!.API_URL}${course.image}`}
                        alt={course.name}
                        className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-t-lg opacity-40"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-lg font-bold">{course.name}</h3>
                        <p className="text-sm">{course.user.first_name}</p>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-b-lg flex justify-between items-center">
                    <h4 className="text-md font-semibold text-green-500">Подробнее</h4>
                </div>
            </div>
        </>
    );
})