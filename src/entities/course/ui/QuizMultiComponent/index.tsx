import { ComponentTask, UserAnswer } from "@/shared/api/course/model";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizMultiComponentProps {
    task: ComponentTask;
    onCheckResult: (quiz: ComponentTask, answers: number[] | string) => Promise<void>;
    onRetryQuiz: (quiz: ComponentTask, answers: number[]) => Promise<void>;
}

export const QuizMultiComponent = observer(({ task, onCheckResult, onRetryQuiz }: QuizMultiComponentProps) => {
    const { title, description, questions, userAnswer } = task;
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array.isArray(userAnswer) ? userAnswer : []);
    const [isRetrying, setIsRetrying] = useState(false);

    const handleOptionChange = (index: number) => {
        if (userAnswer && !isRetrying) return;

        setSelectedAnswers((prevAnswers = []) =>
            prevAnswers.includes(index) ? prevAnswers.filter((answer) => answer !== index) : [...prevAnswers, index]
        );
    };

    const handleCheckResult = async () => {
        if (isRetrying) {
            await onRetryQuiz(task, selectedAnswers);
        } else {
            await onCheckResult(task, selectedAnswers);
        }
    };

    const handleRetryQuiz = async () => {
        setSelectedAnswers([]);
        setIsRetrying(true);
        // await onRetryQuiz(task, []);
    };

    const getCorrectOptions = (userAnswer: number[] | UserAnswer | UserAnswer[]) => {
        if (Array.isArray(userAnswer) && typeof userAnswer[0] === "object") {
            return userAnswer[0]?.userAnswer || [];
        }
        return Array.isArray(userAnswer) ? userAnswer : [];
    };

    const correctOptions = userAnswer ? getCorrectOptions(userAnswer) : [];

    return (
        <div className="quiz-component bg-white">
            {title && <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{title}</h2>}
            {description && <p className="text-gray-600 mb-4 text-center">{description}</p>}

            {questions.map((questionItem, questionIndex) => (
                <div key={questionIndex} className="mb-6">
                   <div className="flex items-center justify-between mb-2">
                       <h3 className="text-lg font-semibold text-gray-800">Вопрос: {questionItem.question}</h3>

                       {userAnswer && !isRetrying && (
                           <Button onClick={handleRetryQuiz} type="default">
                               Попробовать еще раз
                           </Button>
                       )}
                   </div>

                    <div className="options">
                        {questionItem.options.map((option, optionIndex) => {
                            const isCorrectOption = correctOptions.includes(optionIndex);
                            const isUserSelected = selectedAnswers.includes(optionIndex);

                            let optionClass = "block cursor-pointer mb-2 p-4 border rounded-lg transition-all ";

                            if (userAnswer && !isRetrying) {
                                if (isCorrectOption) {
                                    optionClass += "bg-green-100 border-green-500";
                                } else if (isUserSelected) {
                                    optionClass += "bg-red-100 border-red-500";
                                } else {
                                    optionClass += "bg-white border-gray-300";
                                }
                            } else {
                                if (isUserSelected) {
                                    optionClass += "bg-blue-100 border-blue-500";
                                } else {
                                    optionClass += "bg-white border-gray-300";
                                }
                            }

                            return (
                                <label key={optionIndex} className={optionClass}>
                                    <input
                                        type="checkbox"
                                        disabled={!!userAnswer && !isRetrying}
                                        value={optionIndex}
                                        checked={isUserSelected || (userAnswer && isCorrectOption)}
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

            <div className="flex justify-between mt-4">
                <Button
                    type="primary"
                    onClick={handleCheckResult}
                    disabled={!isRetrying && !!userAnswer}
                    className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                >
                    {isRetrying ? "Завершить повторное прохождение" : "Завершить"}
                </Button>
            </div>
        </div>
    );
});
