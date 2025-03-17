import { observer } from "mobx-react";
import React, { FC, useState } from "react";
import {Button, Modal, Typography} from "antd";
import { useTheme } from "next-themes";
import { useParams, useSearchParams } from "next/navigation";
import {CheckCircleOutlined} from "@ant-design/icons";

import { Exam } from "@/shared/api/exams/model";
import { QuizComponent, QuizMultiComponent, SimpleTask } from "@/entities/course/ui";
import { CourseComponentType } from "@/shared/api/component/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { ComponentTask } from "@/shared/api/course/model";


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

    const handleAnswerSelect = async (quiz: ComponentTask, answer: number[] | string) => await courseStore.handleCheckTask({
            task: quiz,
            answers: answer,
            currentSection: step!,
        }, Number(courseId));

    const handleConfirmSubmit = async () => {
        await courseStore.submitExamAnswerUser(Number(courseId)).then(response => {

        }).catch(e => {

        }).finally(() => {
            setOpenPreviewModal(false);
        });

    };


    return (
        <>
            <Modal
                open={openPreviewModal}
                centered
                onCancel={() => setOpenPreviewModal(false)}
                okText="Да, отправить"
                cancelText="Отмена"
                title="Подтверждение отправки"
                footer={
                    <div>
                        <Button onClick={() => setOpenPreviewModal(false)}>Отмена</Button>
                        <Button onClick={handleConfirmSubmit} className="ml-2" color="default" variant="solid">Да, отправить</Button>
                    </div>
                }
            >
                <Typography.Paragraph>
                    Проверьте свои ответы перед отправкой. Убедитесь, что все заполнено правильно.
                </Typography.Paragraph>

                <Typography.Paragraph>
                    Если вы наберете <b>более 75%</b> правильных ответов, вы получите сертификат.
                </Typography.Paragraph>

                <Typography.Paragraph>
                    Обратите внимание, что после отправки результаты будут окончательными и не подлежат изменению. Убедитесь, что все ответы верны.
                </Typography.Paragraph>
            </Modal>


            <div className="flex flex-col lg:flex-row xl:flex-row 2xl:flex-row">
                <div
                    className="flex flex-col justify-between p-5 border-b border-gray-300 overflow-y-auto w-full lg:w-64 xl:w-64 2xl:w-64 lg:border-r lg:border-b-0 xl:border-r xl:border-b-0 2xl:border-r 2xl:border-b-0">
                    <div>
                        <h3 className="mb-5 text-center text-lg font-semibold dark:text-white">Вопросы</h3>
                        <div className="flex items-center flex-wrap gap-3 p-4">
                            {exam?.components.map((component, index) => (
                                <div
                                    key={component.id}
                                    onClick={() => handleSelectQuestion(index)}
                                    className={`w-12 h-12 flex justify-center items-center rounded-lg border shadow-sm transition-all duration-300 relative ${
                                        currentQuestionIndex === index
                                            ? "bg-blue-500 border-blue-700"
                                            : "bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                                    }`}
                                >
                                    <p className={currentQuestionIndex !== index ? "text-black" : "text-white"}>{index + 1}</p>

                                    {component?.componentTask?.userAnswer && (
                                        <div
                                            className="absolute -top-2 -right-2 p-1 rounded-lg shadow-lg bg-blue-500 text-white"
                                        >
                                            <CheckCircleOutlined className="text-xl"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {
                        !exam?.exam.isEndExam && <div className="flex justify-end">
                            <Button color="default" variant="solid" onClick={() => setOpenPreviewModal(true)}>
                                Отправить на проверку
                            </Button>
                        </div>
                    }
                </div>

                <div className="flex-1 relative">
                    <div className="mb-5">
                    {currentComponent && currentComponent.componentTask.type === CourseComponentType.Quiz && (
                            <QuizComponent task={currentComponent.componentTask} onCheckResult={handleAnswerSelect}
                                           isExamTask isEndExam={exam?.exam.isEndExam}/>
                        )}
                        {currentComponent && currentComponent.componentTask.type === CourseComponentType.MultiPlayChoice && (
                            <QuizMultiComponent task={currentComponent.componentTask} onCheckResult={handleAnswerSelect}
                                                isExamTask isEndExam={exam?.exam.isEndExam}/>
                        )}
                        {currentComponent && currentComponent.componentTask.type === CourseComponentType.SimpleTask && (
                            <SimpleTask task={currentComponent.componentTask} onCheckResult={handleAnswerSelect}
                                        isExamTask isEndExam={exam?.exam.isEndExam}/>
                        )}
                    </div>

                    <div className="flex justify-between px-4">
                        <Button
                            onClick={handlePreviousQuestion}
                            color="default"
                            variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                            disabled={currentQuestionIndex === 0}
                        >
                            Назад
                        </Button>
                        <Button
                            onClick={handleNextQuestion}
                            color="default"
                            variant={resolvedTheme === "dark" ? "outlined" : "solid"}
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
