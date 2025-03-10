import { observer } from "mobx-react";
import { Exam } from "@/shared/api/exams/model";
import React, { FC, useState } from "react";
import { QuizComponent, QuizMultiComponent, SimpleTask } from "@/entities/course/ui";
import { CourseComponentType } from "@/shared/api/component/model";
import {Button, Modal, Table, Typography} from "antd";
import { useTheme } from "next-themes";
import { useMobxStores } from "@/shared/store/RootStore";
import { useParams, useSearchParams } from "next/navigation";
import { ComponentTask } from "@/shared/api/course/model";
import {CheckCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";

interface ExamCourseProps {
    exam?: Exam;
}

const ExamCourse: FC<ExamCourseProps> = observer(({ exam }) => {
    const { courseStore } = useMobxStores();
    const { courseId } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const { resolvedTheme } = useTheme();
    const searchParams = useSearchParams();
    const stepParam = searchParams.get("step");
    const step = !isNaN(Number(stepParam)) && Number(stepParam) !== 0 ? Number(stepParam) : null;

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (exam?.components?.length || 0) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSelectQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const currentComponent = exam?.components[currentQuestionIndex];

    const handleAnswerSelect = async (quiz: ComponentTask, answer: number[] | string) => {
        return await courseStore.handleCheckTask({
            task: quiz,
            answers: answer,
            currentSection: step!,
        }, Number(courseId));
    };

    const handleConfirmSubmit = () => {
        setOpenPreviewModal(false);
    };

    const columns = [
        {
            title: "№",
            dataIndex: "index",
            key: "index",
            render: (text: string) => <b>{text}</b>
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <div className="flex items-center gap-2">
                    {status === "Отвечен" ? (
                        <CheckCircleOutlined className="text-green-500" />
                    ) : (
                        <InfoCircleOutlined className="text-gray-500" />
                    )}
                    {status}
                </div>
            )
        },
        {
            title: "Ответ",
            dataIndex: "answer",
            key: "answer",
        }
    ];

    const data = exam?.components.map(({ componentTask }, index) => {
        const userAnswer = componentTask.userAnswer?.answer[0]?.userAnswer;

        return {
            key: index,
            index: index + 1,
            status: userAnswer ? "Отвечен" : "Не отвечен",
            answer: Array.isArray(userAnswer)
                ? userAnswer.join(', ')
                : userAnswer ?? "—"
        };
    });

    return (
       <>
           <Modal
               open={openPreviewModal}
               centered
               onCancel={() => setOpenPreviewModal(false)}
               onOk={handleConfirmSubmit}
               okText="Да, отправить"
               cancelText="Отмена"
               title="Подтверждение отправки"
           >
               <Typography.Paragraph>Проверьте свои ответы перед отправкой:</Typography.Paragraph>
               <Table columns={columns} dataSource={data} pagination={false} />
           </Modal>

           <div className="flex flex-col md:flex-row">
               {/* Sidebar */}
               <div className="w-full flex flex-col justify-between md:w-64 p-5 md:border-b lg:border-r border-gray-300 overflow-y-auto">
                   <div>
                       <h3 className="mb-5 text-center text-lg font-semibold dark:text-white">Вопросы</h3>
                       <div className="flex items-center flex-wrap gap-3 p-4">
                           {exam?.components.map((component, index) => (
                               <div
                                   key={index}
                                   onClick={() => handleSelectQuestion(index)}
                                   className={`w-12 h-12 flex justify-center items-center rounded-lg border shadow-sm transition-all duration-300 relative ${
                                       currentQuestionIndex === index
                                           ? "bg-blue-500 text-white border-blue-700"
                                           : "bg-white text-black border-gray-300 cursor-pointer hover:bg-gray-200"
                                   }`}
                               >
                                   {index + 1}

                                   {component.componentTask.userAnswer &&  <div
                                       className={`absolute -top-2 -right-2 p-1 rounded-lg shadow-lg bg-blue-500`}
                                   ><CheckCircleOutlined className="text-blue-600 text-xl" />
                                   </div>}

                               </div>
                           ))}
                       </div>
                   </div>

                   <Button color="default" variant="solid" onClick={() => setOpenPreviewModal(true)}>
                       Отправить на проверку
                   </Button>
               </div>

               <div className="flex-1 p-5 relative">
                   <div className="mb-5">
                       {currentComponent && currentComponent.componentTask.type === CourseComponentType.Quiz && (
                           <QuizComponent task={currentComponent.componentTask} onCheckResult={handleAnswerSelect} examTask/>
                       )}
                       {currentComponent && currentComponent.componentTask.type === CourseComponentType.MultiPlayChoice && (
                           <QuizMultiComponent task={currentComponent.componentTask} onCheckResult={handleAnswerSelect} />
                       )}
                       {currentComponent && currentComponent.componentTask.type === CourseComponentType.SimpleTask && (
                           <SimpleTask task={currentComponent.componentTask} onCheckResult={handleAnswerSelect} />
                       )}
                   </div>

                   <div className="flex justify-between">
                       <Button
                           onClick={handlePreviousQuestion}
                           color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                           disabled={currentQuestionIndex === 0}
                       >
                           Назад
                       </Button>
                       <Button
                           onClick={handleNextQuestion}
                           color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                           disabled={currentQuestionIndex === (exam?.components.length || 1) - 1}
                       >
                           Вперед
                       </Button>
                   </div>
               </div>
           </div>
       </>
    );
});

export default ExamCourse;
