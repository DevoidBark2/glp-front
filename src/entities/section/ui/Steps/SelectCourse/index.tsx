"use client"
import { Button, Empty, Form, List } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CourseMiniCard } from "@/entities/course/ui/CourseMiniCard";
import { useMobxStores } from "@/stores/stores";
import { FormInstance } from "antd/lib";
import { useEffect } from "react";
import { observer } from "mobx-react";

interface SelectCourseProps {
    createSectionForm: FormInstance
}

export const SelectCourse = observer(({createSectionForm}: SelectCourseProps) => {
    const { courseStore } = useMobxStores();
    const router = useRouter();

    useEffect(() => {
        courseStore.getCoursesForCreator();
    },[])

    return (
        <Form.Item
         name="course"
        >
            <List
                locale={{
                    emptyText: <Empty description="Список пуст">
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={() => router.push('/control-panel/courses/add')}
                        >
                            Создать курс
                        </Button>
                    </Empty>
                }}
                grid={{ gutter: 16, column: 5 }}
                loading={courseStore.loadingCourses}
                dataSource={courseStore.userCourses}
                renderItem={(course) => (
                    <CourseMiniCard course={course} createSectionForm={createSectionForm}/>
                )}
            />
        </Form.Item>
    )
})