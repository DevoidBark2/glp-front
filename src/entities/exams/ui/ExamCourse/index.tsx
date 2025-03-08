import { observer } from "mobx-react";
import { Exam } from "@/shared/api/exams/model";
import React, { FC, useEffect, useState } from "react";
import { QuizComponent, QuizMultiComponent, SimpleTask } from "@/entities/course/ui";
import { CourseComponentType } from "@/shared/api/component/model";
import { Button } from "antd";
import { useTheme } from "next-themes";
import { useMobxStores } from "@/shared/store/RootStore";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { ComponentTask } from "@/shared/api/course/model";

interface ExamCourseProps {
    exam?: Exam;
}

const ExamCourse: FC<ExamCourseProps> = observer(({ exam }) => {
    const { courseStore } = useMobxStores();
    const { courseId } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

    return (
        <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 p-5 md:border-b lg:border-r border-gray-300 overflow-y-auto">
                <h3 className="mb-5 text-center text-lg font-semibold dark:text-white">Вопросы</h3>
                <div className="flex items-center flex-wrap gap-3 p-4">
                    {exam?.components.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelectQuestion(index)}
                            className={`w-12 h-12 flex justify-center items-center rounded-lg border shadow-sm transition-all duration-300 ${currentQuestionIndex === index
                                ? "bg-blue-500 text-white border-blue-700"
                                : "bg-white text-black border-gray-300 cursor-pointer hover:bg-gray-200"
                                }`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-5 relative">
                <div className="mb-5">
                    {currentComponent && currentComponent.componentTask.type === CourseComponentType.Quiz && (
                        <QuizComponent task={currentComponent.componentTask} onCheckResult={handleAnswerSelect} />
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
    );
});

export default ExamCourse;
