import { ComponentTask, UserAnswer } from "@/shared/api/course/model";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface QuizMultiComponentProps {
    task: ComponentTask;
    onCheckResult: (quiz: ComponentTask, answers: number[]) => Promise<any>;
}

export const QuizMultiComponent = observer(({ task, onCheckResult }: QuizMultiComponentProps) => {
    const { title, description, questions, userAnswer } = task;
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
        Array.isArray(userAnswer?.answer[0].userAnswer) ? userAnswer?.answer[0].userAnswer : []
    );

    const [isRetrying, setIsRetrying] = useState(false);
    const { resolvedTheme } = useTheme();

    const handleOptionChange = (index: number) => {
        if (userAnswer && !isRetrying) return;

        setSelectedAnswers((prevAnswers = []) =>
            prevAnswers.includes(index) ? prevAnswers.filter((answer) => answer !== index) : [...prevAnswers, index]
        );
    };

    // Проверка результата после завершения задания
    const handleCheckResult = async () => {
        await onCheckResult(task, selectedAnswers).then(result => {
            const userAnswers = result.userAnswer?.answer[0].userAnswer || [];
            setSelectedAnswers(userAnswers);
        });
    };

    // Повторное прохождение задания
    const handleRetryQuiz = async () => {
        setSelectedAnswers([]);
        setIsRetrying(true);
    };

    // Извлечение информации о правильности для всех выбранных ответов
    const isCorrect = userAnswer?.answer[0].isCorrect;

    // Логика для определения класса
    const getOptionClass = (optionIndex: number) => {
        let optionClass = "block cursor-pointer mb-2 p-4 border rounded-lg transition-all ";

        // Если ответ уже есть и проверен
        if (userAnswer && !isRetrying) {
            if (selectedAnswers.includes(optionIndex)) {
                if (isCorrect) {
                    // Если правильный ответ, окрашиваем в зелёный
                    optionClass += "bg-green-100 border-green-500";
                } else {
                    // Если неправильный ответ, окрашиваем в красный
                    optionClass += "bg-red-100 border-red-500";
                }
            } else {
                optionClass += "bg-white border-gray-300"; // Не выбранный вариант
            }
        } else {
            // Если ответ ещё не проверен, показываем синий для выбранных вариантов
            if (selectedAnswers.includes(optionIndex)) {
                optionClass += "bg-blue-100 border-blue-500"; // Выбранный вариант
            } else {
                optionClass += "bg-white border-gray-300"; // Не выбранный вариант
            }
        }

        return optionClass;
    };

    useEffect(() => {
        // Логика для перерисовки при изменении selectedAnswers
        console.log(selectedAnswers); // Здесь будет выводиться обновленный список выбранных вариантов
    }, [selectedAnswers]); // Когда selectedAnswers изменится, этот эффект будет вызываться

    return (
        <div className="quiz-component">
            {title && <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center dark:text-white">{title}</h2>}
            {description && <p className="text-gray-600 mb-4 text-center dark:text-white">{description}</p>}

            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Вопрос: {questions[0].question}</h3>

                    {userAnswer && !isRetrying && (
                        <Button onClick={handleRetryQuiz} color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}>
                            Попробовать еще раз
                        </Button>
                    )}
                </div>

                <div className="options">
                    {questions[0].options.map((option, optionIndex) => {
                        const optionClass = getOptionClass(optionIndex); // Получаем класс для каждого варианта

                        return (
                            <label key={optionIndex} className={optionClass}>
                                <input
                                    type="checkbox"
                                    disabled={!!userAnswer && !isRetrying} // Отключаем возможность изменения, если ответ уже есть и не происходит повтор
                                    value={optionIndex}
                                    checked={selectedAnswers.includes(optionIndex)} // Если ответ выбран
                                    onChange={() => handleOptionChange(optionIndex)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <Button
                    color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                    onClick={handleCheckResult}
                    disabled={!isRetrying && !!userAnswer}
                    className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                >
                    Завершить
                </Button>
            </div>
        </div>
    );
});
