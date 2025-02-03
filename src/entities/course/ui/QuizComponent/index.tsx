import { CourseComponentTypeI } from "@/shared/api/course/model";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizComponentProps {
    task: CourseComponentTypeI;
    onCheckResult: (quiz: CourseComponentTypeI, answers: number[]) => Promise<void>;
}

export const QuizComponent = observer(({ task, onCheckResult }: QuizComponentProps) => {
    const { title, description, questions, userAnswer } = task;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
    const [disabledCheckResultBtn, setDisabledCheckResultBtn] = useState(!!task.userAnswer);
    const [retryDisabled, setRetryDisabled] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionChange = (index: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = index;
        setSelectedAnswers(newAnswers);
    };

    const handleCheckResult = async () => {
        await onCheckResult(task, selectedAnswers);
        setDisabledCheckResultBtn(true);
    };

    const handleRetryQuiz = () => {
        setSelectedAnswers(Array(questions.length).fill(null));
        setCurrentQuestionIndex(0);
        setDisabledCheckResultBtn(false);
        setRetryDisabled(true);
    };

    console.log(userAnswer)

    return (
        <div className="quiz-container mb-6 transition-transform p-4">
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>

            <div className="question mb-4">
                <div className="flex justify-between items-center mb-2 flex-wrap">
                    <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold">
                            Вопрос {currentQuestionIndex + 1}: {currentQuestion.question}
                        </h4>
                    </div>

                    {userAnswer && <Button onClick={handleRetryQuiz} type="default" disabled={retryDisabled}>
                        Попробовать еще раз
                    </Button>}
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const userSelectedIndex = userAnswer?.answer[currentQuestionIndex].userAnswer

                        const isCorrectAnswer = userAnswer?.answer[currentQuestionIndex].isCorrect

                        const isSelected = selectedAnswers[currentQuestionIndex] === index;
                        const isUserAnswer = userSelectedIndex === index;
                        const isCorrect = isUserAnswer && isCorrectAnswer;
                        const isWrong = isUserAnswer && !isCorrectAnswer;

                        const completedStyle = isCorrect
                            ? "bg-green-100 border-green-500"
                            : isWrong
                                ? "bg-red-100 border-red-500"
                                : "bg-gray-50 border-gray-300";

                        const activeStyle = isSelected ? "bg-blue-100 border-blue-500" : "bg-gray-50 border-gray-300";
                        const finalStyle = userAnswer ? completedStyle : activeStyle;

                        return (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${finalStyle}`}
                                onClick={() => !userAnswer && handleOptionChange(index)}
                            >
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestionIndex}`}
                                        value={index}
                                        checked={isUserAnswer || isSelected}
                                        onChange={() => handleOptionChange(index)}
                                        disabled={!!userAnswer && retryDisabled}
                                        className="mr-2"
                                    />
                                    {option}
                                </label>
                            </div>
                        );
                    })}
                </div>

            </div>

            <div className="flex justify-between mt-4">
                {currentQuestionIndex > 0 && <Button onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={currentQuestionIndex === 0}>
                    Назад
                </Button>}

                {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>Далее</Button>
                ) : (
                    <Button onClick={handleCheckResult} disabled={disabledCheckResultBtn} type="primary">
                        Завершить
                    </Button>
                )}
            </div>
        </div>
    );
});
