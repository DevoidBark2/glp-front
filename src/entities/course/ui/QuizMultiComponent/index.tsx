import { CourseComponentTypeI, UserAnswer } from "@/shared/api/course/model";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useState, useEffect } from "react";

interface QuizMultiComponentProps {
    task: CourseComponentTypeI;
    onCheckResult: (quiz: CourseComponentTypeI, answers: number[] | string) => Promise<void>;
}

export const QuizMultiComponent = observer(({ task, onCheckResult }: QuizMultiComponentProps) => {
    const { title, description, questions, userAnswer } = task;

    // Инициализация состояния с учётом userAnswer, если оно есть
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(userAnswer);

    // Функция для обновления выбранных ответов
    const handleOptionChange = (index: number) => {
        setSelectedAnswers((prevAnswers) => {
            if (prevAnswers.includes(index)) {
                return prevAnswers.filter((answer) => answer !== index);
            }
            return [...prevAnswers, index];
        });
    };

    // Функция для обработки результата
    const handleCheckResult = async () => {
        await onCheckResult(task, selectedAnswers);
    };

    // Функция для получения правильных ответов из userAnswer
    const getCorrectOptions = (userAnswer: number[] | UserAnswer | UserAnswer[]) => {
        return userAnswer[0]?.userAnswer || []; // Если это массив объектов UserAnswer, извлекаем первый
    };

    const correctOptions = userAnswer ? getCorrectOptions(userAnswer) : [];

    return (
        <div className="quiz-component bg-white">
            {title && <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{title}</h2>}
            {description && <p className="text-gray-600 mb-4 text-center">{description}</p>}

            {questions.map((questionItem, questionIndex) => (
                <div key={questionIndex} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Вопрос: {questionItem.question}</h3>

                    <div className="options">
                        {questionItem.options.map((option, optionIndex) => {
                            // Проверка, является ли опция правильной для данного ответа
                            const isCorrectOption = correctOptions?.includes(optionIndex);
                            const isUserSelected = selectedAnswers?.includes(optionIndex);

                            // Условия для окраски
                            let optionClass = "block cursor-pointer mb-2 p-4 border rounded-lg transition-all ";

                            if (userAnswer) {
                                // Если ответ пользователя уже получен

                                if (isCorrectOption) {
                                    // Зеленый для правильных ответов
                                    optionClass += "bg-green-100 border-green-500";
                                } else if (isUserSelected) {
                                    // Красный для неправильных ответов, которые были выбраны
                                    optionClass += "bg-red-100 border-red-500";
                                } else {
                                    // Если не выбрана опция и она не правильная
                                    optionClass += "bg-white border-gray-300";
                                }
                            } else {
                                // Пока не получен ответ пользователя
                                if (isUserSelected) {
                                    // Выделяем синим для выбранных опций
                                    optionClass += "bg-blue-100 border-blue-500";
                                } else {
                                    // Белый для других опций
                                    optionClass += "bg-white border-gray-300";
                                }
                            }

                            return (
                                <label key={optionIndex} className={optionClass}>
                                    <input
                                        type="checkbox"
                                        disabled={!!userAnswer}  // Делаем input disabled, если уже есть ответ
                                        value={optionIndex}
                                        checked={isUserSelected || isCorrectOption}
                                        onChange={() => handleOptionChange(optionIndex)}
                                        className="mr-2"
                                    />
                                    {option}
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className="flex justify-end">
                <Button
                    type="primary"
                    disabled={!!userAnswer}  // Делаем кнопку недоступной, если уже есть ответ
                    onClick={handleCheckResult}
                    className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                >
                    Завершить
                </Button>
            </div>
        </div>
    );
});
