import { CourseComponentTypeI } from "@/shared/api/course/model";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizComponentProps {
    quiz: CourseComponentTypeI
}


export const QuizComponent = observer(({quiz}: QuizComponentProps) => {
    const { title, questions } = quiz;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionChange = (index: any) => {
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

    const handleResetCurrent = () => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = null; // Сбрасываем ответ для текущего вопроса
        setSelectedAnswers(newAnswers);
    };

    const handleResetAll = () => {
        setSelectedAnswers(Array(questions.length).fill(null)); // Сбрасываем все ответы
    };

    return (
        <div className="quiz-container bg-white rounded-lg shadow-md p-6 mb-6 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
            <div className="question mb-4">
                <h4 className="text-lg font-semibold mb-2">
                    {`Вопрос ${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                </h4>
                <div className="options space-y-3">
                    {currentQuestion.options.map((option:any, index:any) => (
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
                                    onChange={() => handleOptionChange(index)}
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
                    className={`btn ${currentQuestionIndex === 0 ? 'hidden' : 'block'} bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2`}
                >
                    Назад
                </button>
                <button
                    onClick={handleNext}
                    className={`btn ${currentQuestionIndex === questions.length - 1 ? 'hidden' : 'block'} bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2`}
                >
                    Далее
                </button>
                {currentQuestionIndex === questions.length - 1 && (
                    <button
                        onClick={() => {
                            // Логика завершения квиза (можно, например, показать результаты)
                            alert('Квиз завершён! Ваши ответы: ' + selectedAnswers.join(', '));
                        }}
                        className="btn bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
                    >
                        Завершить
                    </button>
                )}
            </div>
            <div className="reset-buttons flex justify-between mt-4">
                <button
                    onClick={handleResetCurrent}
                    className="btn bg-yellow-400 hover:bg-yellow-500 text-black rounded px-4 py-2"
                >
                    Сбросить ответ на текущий вопрос
                </button>
                <button
                    onClick={handleResetAll}
                    className="btn bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
                >
                    Сбросить все ответы
                </button>
            </div>
        </div>
    );
})