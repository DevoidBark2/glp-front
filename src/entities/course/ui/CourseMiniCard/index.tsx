import { Course } from "@/shared/api/course/model"
import { Badge, Button, Card, List, Tag } from "antd";
import { ClockCircleOutlined, ExportOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import { FormInstance } from "antd/lib";

interface CourseMiniCardProps {
    course: Course,
    createSectionForm: FormInstance
}

export const CourseMiniCard = observer(({course,createSectionForm} : CourseMiniCardProps) => {
    const { courseStore } = useMobxStores();
    const router = useRouter();

    const handleSelectCourse = (course:Course) => {
        courseStore.setSelectedCourse(course)
        createSectionForm.setFieldsValue({ course: course });
    }

    const renderLevelCourse = (levelCourse: number) => {
        switch (levelCourse) {
            case 0:
                return "Легкий";
            case 1:
                return "Средний";
            case 2:
                return "Сложный";
            default:
                return <Tag color="default">Неизвестно</Tag>;
        }
    }
    
    return (
        <List.Item>
            <Badge text={course.status}>
                <Card
                    key={course.id}
                    title={<div className="flex justify-between">
                        <p>{course.name}</p>
                        <Button
                            icon={<ExportOutlined />}
                            title="Перейти к курсу"
                            onClick={(event) => {
                                event.preventDefault();
                                router.push(`/control-panel/courses/${course.id}`)
                            }}
                        />
                    </div>}
                    hoverable
                    onClick={() => handleSelectCourse(course)}
                    style={{
                        width: 240,
                        margin: 8,
                        border: courseStore.selectedCourse?.id === course.id ? '2px solid #1890ff' : '2px solid #f0f0f0',
                        backgroundColor: courseStore.selectedCourse?.id === course.id ? '#e6f7ff' : '#fff',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Card.Meta
                        description={
                            <div>
                                <p><ClockCircleOutlined /> {course.duration} ч.</p>
                                <p>Категория: {course.category?.name ?? "Категория отсутствует"}</p>
                                <p>Уровень: {renderLevelCourse(course.level)}</p>
                                <p>Дата публикации: {new Date(course.publish_date).toLocaleDateString()}</p>
                            </div>
                        }
                        style={{ textAlign: 'left' }}
                    />
                </Card>
            </Badge>
        </List.Item>
    )
})