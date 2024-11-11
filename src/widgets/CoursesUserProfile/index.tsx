import { CourseProfileList } from "@/entities/course/ui"
import { Divider } from "antd"

export const CourseUserProfle = () => {
    return (
        <div className="w-3/5 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Ваши курсы</h2>
            <Divider />
            <CourseProfileList/>
        </div>
    )
}