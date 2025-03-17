import {Button, message} from "antd";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { ComponentTask } from "@/shared/api/course/model";

interface QuizMultiComponentProps {
    task: ComponentTask;
    onCheckResult: (quiz: ComponentTask, answers: number[]) => Promise<any>;
    isExamTask?: boolean;
    isEndExam?: boolean;
}

export const QuizMultiComponent = observer(({ task, onCheckResult,isExamTask,isEndExam }: QuizMultiComponentProps) => {
    const { title, description, questions, userAnswer } = task;
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(userAnswer
        ? userAnswer.answer.map((ans) => ans.userAnswer)
        : Array(questions.length).fill(null));
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
        if (userAnswer && !isRetrying) {return;}

        setSelectedAnswers((prevAnswers = []) =>
            prevAnswers.includes(index) ? prevAnswers.filter((answer) => answer !== index) : [...prevAnswers, index]
        );
    };

    const handleCheckResult = async () => {
        if (selectedAnswers.length === 0) {
            message.warning("Выберите варианты ответов!");
            return;
        }
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
        let optionClass = "block cursor-pointer mb-2 p-4 border rounded-lg break-all transition-all ";

        if (userAnswer && !isRetrying) {
            if (selectedAnswers.includes(optionIndex)) {
                optionClass += isCorrect === true
                    ? "bg-green-100 border-green-500"
                    : isCorrect === false
                        ? "bg-red-100 border-red-500"
                        : "bg-blue-100 border-blue-500";
            } else {
                optionClass += "bg-white border-gray-300";
            }
        } else {
            optionClass += selectedAnswers.includes(optionIndex) ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300";
        }

        return optionClass;
    };

    return (
        <div className="quiz-component p-4">
            {title && <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center dark:text-white break-words">{title}</h2>}
            {description && <p className="text-gray-600 mb-4 text-center dark:text-white break-words">{description}</p>}

            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white break-all">Вопрос: {questions[0].question}</h2>

                    {!isEndExam && userAnswer && !isRetrying && (
                        <Button onClick={handleRetryQuiz} color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}>
                            Попробовать еще раз
                        </Button>
                    )}
                </div>

                <div className="options">
                    {questions[0].options.map((option, optionIndex) => (
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
                        ))}
                </div>
            </div>

            <div className="flex justify-between mt-4">
                {
                    !isEndExam && <Button
                        color="default"
                        variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                        onClick={handleCheckResult}
                        disabled={!isRetrying && !!userAnswer}
                        className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                    >
                        {isExamTask ? "Сохранить ответ" : "Завершить"}
                    </Button>
                }
            </div>
        </div>
    );
});
