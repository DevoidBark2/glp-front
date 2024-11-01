import { Button, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import nextConfig from "next.config.mjs";

export const CourseItem = ({ course }: any) => {
    return (
        <div
            key={course.id}
            onClick={() => {
                // courseStore.setSelectedCourseForDetailModal(course);
                // courseStore.setOpenCourseDetailsModal(true);
            }}
            className="relative flex flex-col justify-between rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transform-gpu"
            data-aos="fade-down"
            data-aos-delay="100"
        >
            <div className="relative group">
                <img
                    src={`${nextConfig.env!.API_URL}${course.image}`}
                    alt={course.name}
                    className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-t-lg opacity-40"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-lg font-bold">{course.name}</h3>
                    <p className="text-sm">{course.user.first_name}</p>
                </div>
            </div>
            <div className="p-4 bg-white rounded-b-lg flex justify-between items-center">
                <h4 className="text-md font-semibold text-green-500">Подробнее</h4>
                <Tooltip title="Посмотреть детали" placement="top">
                    <Button
                        type="link"
                        icon={<SearchOutlined />}
                        onClick={() => {
                            // courseStore.setSelectedCourseForDetailModal(course);
                            // courseStore.setOpenCourseDetailsModal(true);
                        }}
                    />
                </Tooltip>
            </div>
        </div>
    );
}