"use client"
import { Button, Empty, Form, List } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib";
import { useEffect } from "react";
import { observer } from "mobx-react";
import Link from "next/link";

import { CourseMiniCard } from "@/entities/course/ui/CourseMiniCard";
import { useMobxStores } from "@/shared/store/RootStore";
import {SectionCourseItem} from "@/shared/api/section/model";

interface SelectCourseProps {
    createSectionForm: FormInstance<SectionCourseItem>
}

export const SelectCourse = observer(({ createSectionForm }: SelectCourseProps) => {
    const { courseStore } = useMobxStores();

    useEffect(() => {
        courseStore.getCoursesByUser();
    }, [])

    return (
        <Form.Item
            name="course"
        >
            <List
                locale={{
                    emptyText: <Empty description="Список пуст">
                        <Button
                            className="transition-opacity hover:opacity-80"
                            type="primary"
                            icon={<PlusCircleOutlined />}
                        >
                            <Link href="/control-panel/courses/add">Создать курс</Link>
                        </Button>
                    </Empty>
                }}
                grid={{ gutter: 20, column: 6 }}
                loading={courseStore.loadingCourses}
                dataSource={courseStore.userCourses}
                renderItem={(course) => (
                    <CourseMiniCard course={course} createSectionForm={createSectionForm} />
                )}
            />
        </Form.Item>
    )
})