import { Button, message } from "antd";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import React, {useEffect, useState} from "react";

import { ComponentTask, UserAnswer } from "@/shared/api/course/model";
import {QuestionsType} from "@/shared/api/component/model";

interface QuizComponentProps {
    task: ComponentTask;
    onCheckResult: (quiz: ComponentTask, answers: number[]) => Promise<any>;
    isExamTask?: boolean
    isEndExam?: boolean
}

export const QuizComponent = observer(({ task, onCheckResult, isExamTask, isEndExam }: QuizComponentProps) => {
    const { title, description, questions, userAnswer } = task;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number[] | null)>(() =>
        userAnswer
            ? userAnswer.answer.map((ans) => ans.userAnswer)
            : Array(questions.length).fill(null)
    );
    const [userAnswers, setUserAnswers] = useState<UserAnswer | null>(userAnswer || null);
    const [disabledCheckResultBtn, setDisabledCheckResultBtn] = useState(!!task.userAnswer);
    const [question,setQuestion] = useState<QuestionsType[] | null>(questions);
    const [isRetrying, setIsRetrying] = useState(false);
    const { resolvedTheme } = useTheme();

    const currentQuestion = question![currentQuestionIndex];

    const handleOptionChange = (index: number) => {
        const newAnswers = [...(selectedAnswers || [])];
        newAnswers[currentQuestionIndex] = index;
        setSelectedAnswers(newAnswers);
    };

    const handleCheckResult = async () => {
        if (selectedAnswers && selectedAnswers.includes(null)) {
            message.warning("Выберите варианты ответов!");
            return;
        }

        if(selectedAnswers) {
            if (isRetrying) {
                await onCheckResult(task, selectedAnswers).then((result) => {
                    setUserAnswers(result.userAnswer);
                });
            } else {
                if (onCheckResult) {
                    await onCheckResult(task, selectedAnswers).then((result) => {
                        setUserAnswers(result.userAnswer);
                    });

                }
            }
        }
        setDisabledCheckResultBtn(true);
        setIsRetrying(false);
    };

    const handleRetryQuiz = () => {
        setSelectedAnswers(Array(questions.length).fill(null));
        setCurrentQuestionIndex(0);
        setDisabledCheckResultBtn(false);
        setUserAnswers(null);
        setIsRetrying(true);
    };


    useEffect(() => {
        if (userAnswer) {
            const normalizedAnswers = userAnswer.answer.map((ans) =>
                Array.isArray(ans.userAnswer)
                    ? ans.userAnswer[0]
                    : ans.userAnswer
            );
            setSelectedAnswers(normalizedAnswers as number[]);
        } else {
            setSelectedAnswers(Array(questions.length).fill(null));
        }

        setUserAnswers(userAnswer!)
        setQuestion(questions)
        setCurrentQuestionIndex(0)
        setDisabledCheckResultBtn(!!task.userAnswer);
    }, [task]);


    return (
        <div className="quiz-container mb-6 transition-transform p-4">
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold dark:text-white break-all">{title}</h3>
                <p className="text-gray-600 dark:text-white break-all">{description}</p>
            </div>

            <div className="question mb-4">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <h4 className="text-lg font-semibold dark:text-white break-all">
                        Вопрос {currentQuestionIndex + 1}: {currentQuestion?.question}
                    </h4>

                    {!isEndExam && userAnswer && !isRetrying && (
                        <Button onClick={handleRetryQuiz} color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}>
                            Попробовать еще раз
                        </Button>
                    )}
                </div>

                <div className="space-y-3 flex flex-col">
                    {currentQuestion?.options.map((option, index) => {
                        const userSelectedIndex = userAnswers?.answer[currentQuestionIndex]?.userAnswer;
                        const isCorrectAnswer = userAnswers?.answer[currentQuestionIndex]?.isCorrect;

                        const isSelected = selectedAnswers && selectedAnswers[currentQuestionIndex] === index;
                        const isUserAnswer = userSelectedIndex === index;
                        const isCorrect = isCorrectAnswer !== undefined && isUserAnswer && isCorrectAnswer;
                        const isWrong = isCorrectAnswer !== undefined && isUserAnswer && !isCorrectAnswer;

                        const completedStyle =
                            isCorrectAnswer === undefined && isSelected
                                ? "bg-blue-100 border-blue-500"
                                : isCorrect
                                    ? "bg-green-100 border-green-500"
                                    : isWrong
                                        ? "bg-red-100 border-red-500"
                                        : "bg-gray-50 border-gray-300";

                        const activeStyle = isSelected
                            ? "bg-blue-100 border-blue-500"
                            : "bg-gray-50 border-gray-300";

                        const finalStyle = userAnswers && !isRetrying
                            ? isCorrectAnswer !== undefined
                                ? completedStyle
                                : activeStyle
                            : activeStyle;

                        return (
                            <button
                                key={index}
                                className={`border rounded-lg p-4 cursor-pointer transition duration-200 break-all ${finalStyle}`}
                                onClick={() => (!userAnswers || isRetrying) && handleOptionChange(index)}
                            >
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestionIndex}`}
                                        value={index}
                                        checked={Boolean(isUserAnswer || isSelected)}
                                        onChange={() => handleOptionChange(index)}
                                        disabled={!!userAnswers && !isRetrying}
                                        className="mr-2"
                                    />
                                    {option}
                                </label>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
                {currentQuestionIndex > 0 && (
                    <Button onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                        color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                    >
                        Назад
                    </Button>
                )}

                {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                    >
                        Далее
                    </Button>
                ) : (
                    !isEndExam && <Button onClick={handleCheckResult} disabled={disabledCheckResultBtn} color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}>
                        {isExamTask ? "Сохранить ответ" : "Завершить"}
                    </Button>
                )}
            </div>
        </div>
    );
});