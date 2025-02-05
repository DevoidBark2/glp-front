import { useMobxStores } from "@/shared/store/RootStore";
import { Button, Empty, FormInstance, List, notification, Radio } from "antd";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Exam } from "@/shared/api/exams/model";
import Link from "next/link";

interface AddationalSettingsProps {
    form: FormInstance
}

export const AddationalSettings = observer(({ form }: AddationalSettingsProps) => {
    const { courseId } = useParams();
    const { examStore } = useMobxStores()
    const [selectedExam, setSelectedExam] = useState<Exam | null>(form.getFieldValue('exam'));


    const handleSave = () => {
        if (selectedExam) {
            examStore.setExamForCourse(selectedExam.id, Number(courseId)).then(response => {
                notification.success({ message: response.message })
            })
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Выбор экзамена
            </h2>
            <p className="text-gray-600 mb-4">
                Выберите экзамен, который будет активным для курса. Нажмите "Сохранить",
                чтобы подтвердить выбор.
            </p>

            {examStore.exams.length > 0 ? <List
                bordered
                dataSource={examStore.exams}
                renderItem={(exam) => (
                    <List.Item
                        className={`cursor-pointer transition-all ${selectedExam?.id === exam.id
                            ? "bg-blue-100 border-l-4 border-blue-500"
                            : "hover:bg-gray-100"
                            }`}
                        onClick={() => setSelectedExam(exam)}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div>
                                <h3 className={`font-bold ${selectedExam?.id === exam.id ? "text-blue-800" : "text-gray-800"}`}>
                                    {exam.title}
                                </h3>
                                <p className="text-gray-500">
                                    Статус:{" "}
                                    <span
                                        className={exam.status === "active" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}
                                    >
                                        {exam.status === "active" ? "Активный" : "Деактивирован"}
                                    </span>
                                </p>
                                <p className="text-gray-500">Создано: {new Date(exam.created_at).toLocaleDateString()}</p>
                            </div>
                            <Radio checked={selectedExam?.id === exam.id} />
                        </div>
                    </List.Item>
                )}
            /> : <Empty
                description={<Link href="/control-panel/exams/add"><Button type="primary">Создать экзамен</Button></Link>}
            />}

            <Button
                type="primary"
                onClick={handleSave}
                className="w-full md:w-auto mt-4"
                disabled={!selectedExam}
            >
                Сохранить выбор
            </Button>
        </div>
    )
})