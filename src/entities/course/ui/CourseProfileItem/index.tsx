import { FORMAT_VIEW_DATE, MAIN_COLOR } from "@/constants"
import { Course } from "@/shared/api/course/model"
import { useMobxStores } from "@/shared/store/RootStore"
import { Button, Popconfirm, Progress, Tooltip } from "antd"
import dayjs from "dayjs"
import nextConfig from "next.config.mjs"
import { useRouter } from "next/navigation"
import { FC } from "react"

type CourseProfileItemProps = {
    course: Course
}

export const CourseProfileItem: FC<CourseProfileItemProps> = ({course} ) => {
    const router = useRouter();
    const {courseStore} = useMobxStores();

    return (
        <div key={course.id} className="p-4 bg-gray-50 mt-4 rounded-md shadow-md hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <img src={`${nextConfig.env!.API_URL}${course?.image}`} alt={course.name} width={100} height={100} className="mr-4" />
                    <div>
                        <h3 className="text-xl font-semibold">{course.name}</h3>
                        <p className="text-gray-600">Дата записи: {dayjs(course.enrolledAt).format(FORMAT_VIEW_DATE)}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Tooltip title={`Перейти к курсу "${course.name}"`}>
                        <Button type="primary" onClick={() => {
                            router.push(`/platform/courses/${course.id}`)
                        }}>Продолжить</Button>
                    </Tooltip>
                    <Popconfirm
                        title={
                            <span className="text-gray-700">
                            <strong>Покинуть данный курс?</strong>
                            <br />
                            <span className="text-sm text-gray-500">
                                Вы можете в любой момент присоединиться снова.
                            </span>
                            </span>
                        }
                        onConfirm={() => courseStore.confirmLeaveCourse(course.id)}
                        placement="leftBottom"
                        okText="Да"
                        cancelText="Нет"
                        >
                        <Button danger className="ml-2">
                            Покинуть курс
                        </Button>
                    </Popconfirm>
                </div>
            </div>
            <Progress percent={course.progress} strokeColor={MAIN_COLOR} />
        </div>
    )
}