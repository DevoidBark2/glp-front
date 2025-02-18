import { observer } from "mobx-react";
import { Exam } from "@/shared/api/exams/model";
import React, { FC, useState } from "react";
import { QuizComponent, QuizMultiComponent, SimpleTask } from "@/entities/course/ui";
import { CourseComponentType } from "@/shared/api/component/model";

interface ExamCourseProps {
    exam?: Exam;
}

const ExamCourse: FC<ExamCourseProps> = observer(({ exam }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


    const handleNextQuestion = () => {
        if (currentQuestionIndex < (exam?.components.length || 0) - 1) {
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

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 p-5 border-r border-gray-300 overflow-y-auto">
                <h3 className="mb-5 text-center text-lg font-semibold">Вопросы</h3>
                <div className="grid grid-cols-4 gap-2 justify-center">
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

            <div className="flex-1 p-5">
                <div className="mb-5">
                    {currentComponent && currentComponent.componentTask.type === CourseComponentType.Quiz && (
                        <QuizComponent task={currentComponent.componentTask} />
                    )}
                    {currentComponent && currentComponent.componentTask.type === CourseComponentType.MultiPlayChoice && (
                        <QuizMultiComponent task={currentComponent.componentTask} />
                    )}
                    {currentComponent && currentComponent.componentTask.type === CourseComponentType.SimpleTask && (
                        <SimpleTask task={currentComponent.componentTask} />
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`px-5 py-2 rounded-lg text-white ${currentQuestionIndex === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        Назад
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === (exam?.components.length || 1) - 1}
                        className={`px-5 py-2 rounded-lg text-white ${currentQuestionIndex === (exam?.components.length || 1) - 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        Вперед
                    </button>
                </div>
            </div>
        </div>

    );
});

export default ExamCourse;
