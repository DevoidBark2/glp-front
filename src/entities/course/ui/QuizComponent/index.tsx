import { CourseComponentTypeI } from "@/shared/api/course/model";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizComponentProps {
    quiz: CourseComponentTypeI
}


export const QuizComponent = observer(({ quiz }: QuizComponentProps) => {
    const { title, description, questions } = quiz;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
    const { courseComponentStore } = useMobxStores();

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionChange = (index: any) => {
        debugger
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = index; // Сохраняем ответ для текущего вопроса
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleCheckResult = () => {
        const q = quiz;
        const a = selectedAnswers;
        debugger

        courseComponentStore.handleCheckTask({task: quiz, answers:  selectedAnswers});
    }

    return (
        <div className="quiz-container mb-6 transition-transform">
            <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
            <h6 className="text-gray-600 mb-4">{description}</h6>
            <div className="question mb-4">
                <h4 className="text-lg font-semibold mb-2">
                    {`Вопрос ${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                </h4>
                <div className="options space-y-3">
                    {currentQuestion.options.map((option: string, index: number) => (
                        <div
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer transition duration-200 
                                        ${selectedAnswers[currentQuestionIndex] === index ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
                            onClick={() => handleOptionChange(index)}
                        >
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name={`question-${currentQuestionIndex}`}
                                    value={index}
                                    checked={selectedAnswers[currentQuestionIndex] === index}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="navigation flex justify-between mt-4">
                <button
                    onClick={handleBack}
                    className={`btn ${currentQuestionIndex === 0 ? 'hidden' : 'block'} bg-[#001529] hover:scale-105 transition-transform transform text-white rounded px-4 py-2`}
                >
                    Назад
                </button>
                <button
                    onClick={handleNext}
                    className={`btn ${currentQuestionIndex === questions.length - 1 ? 'hidden' : 'block'} bg-[#001529] hover:scale-105 transition-transform transform text-white rounded px-4 py-2`}
                >
                    Далее
                </button>
                {currentQuestionIndex === questions.length - 1 && (
                    <button
                    onClick={() => handleCheckResult()}
                    className="btn bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
                >
                    Завершить
                </button>
                )}
            </div>
        </div>
    );
})