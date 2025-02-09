import { CourseProfileList } from "@/entities/course/ui"
import { Divider } from "antd"

export const CourseUserProfile = () => {
    return (
        <div className="w-full lg:w-3/5 bg-black border border-neon-blue rounded-lg shadow-[0_0_15px_#00FFFF] p-6">
            <h2 className="text-2xl font-bold mb-4 text-neon-green">Ваши курсы</h2>
            <Divider className="border-neon-blue" />
            <CourseProfileList />
        </div>
    )
}