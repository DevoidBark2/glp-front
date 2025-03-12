import { ComponentTask } from "@/shared/api/course/model";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface QuizMultiComponentProps {
    task: ComponentTask;
    onCheckResult: (quiz: ComponentTask, answers: number[]) => Promise<any>;
    isExamTask?: boolean;
}

export const QuizMultiComponent = observer(({ task, onCheckResult,isExamTask }: QuizMultiComponentProps) => {
    const { title, description, questions, userAnswer } = task;
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [isRetrying, setIsRetrying] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (userAnswer?.answer?.[0]?.userAnswer) {
            setSelectedAnswers(
                Array.isArray(userAnswer.answer[0].userAnswer)
                    ? userAnswer.answer[0].userAnswer
                    : [userAnswer.answer[0].userAnswer]
            );
        } else {
            setSelectedAnswers([]);
        }
        setIsRetrying(false);
    }, [userAnswer]);


    const handleOptionChange = (index: number) => {
        if (userAnswer && !isRetrying) return;

        setSelectedAnswers((prevAnswers = []) =>
            prevAnswers.includes(index) ? prevAnswers.filter((answer) => answer !== index) : [...prevAnswers, index]
        );
    };

    const handleCheckResult = async () => {
        await onCheckResult(task, selectedAnswers).then(result => {
            setSelectedAnswers(result.userAnswer?.answer[0]?.userAnswer || []);
        });
    };

    const handleRetryQuiz = async () => {
        setSelectedAnswers([]);
        setIsRetrying(true);
    };

    const isCorrect = userAnswer?.answer[0]?.isCorrect;

    const getOptionClass = (optionIndex: number) => {
        let optionClass = "block cursor-pointer mb-2 p-4 border rounded-lg transition-all ";

        if (userAnswer && !isRetrying) {
            if (selectedAnswers.includes(optionIndex)) {
                optionClass += isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
            } else {
                optionClass += "bg-white border-gray-300";
            }
        } else {
            optionClass += selectedAnswers.includes(optionIndex) ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300";
        }

        return optionClass;
    };

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
                        return (
                            <label key={optionIndex} className={getOptionClass(optionIndex)}>
                                <input
                                    type="checkbox"
                                    disabled={!!userAnswer && !isRetrying}
                                    value={optionIndex}
                                    checked={selectedAnswers.includes(optionIndex)}
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
                    color="default"
                    variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                    onClick={handleCheckResult}
                    disabled={!isRetrying && !!userAnswer}
                    className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                >
                    {isExamTask ? "Сохранить ответ" : "Завершить"}
                </Button>
            </div>
        </div>
    );
});
