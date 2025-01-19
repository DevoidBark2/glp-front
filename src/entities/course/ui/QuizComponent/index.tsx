import { CourseComponentTypeI } from "@/shared/api/course/model";
import { useMobxStores } from "@/stores/stores";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizComponentProps {
    quiz: CourseComponentTypeI;
    currentSection: number
}

export const QuizComponent = observer(({ quiz, currentSection }: QuizComponentProps) => {
    const { title, description, questions } = quiz;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
    const [disabledCheckResultBtn, setDisabledCheckResultBtn] = useState(!!quiz.userAnswer);
    const [retryDisabled, setRetryDisabled] = useState(false);
    const { courseComponentStore, courseStore } = useMobxStores();

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionChange = (index: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = index;
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
        const a = currentSection;
        courseStore
            .handleCheckTask({ task: quiz, answers: selectedAnswers, currentSection: Number(currentSection) })
            .then(() => {
                setDisabledCheckResultBtn(true);
            });
    };

    const handleRetryQuiz = () => {
        const a = courseStore.fullDetailCourse?.sections[0];
        setSelectedAnswers(Array(questions.length).fill(null));
        setCurrentQuestionIndex(0);

        setDisabledCheckResultBtn(false);
        setRetryDisabled(true); // Disable the retry button
    };

    const renderIconCountAnswerUser = (quiz: CourseComponentTypeI) => {
        if (!quiz || !quiz.userAnswer || quiz.userAnswer.length === 0) {
            return null;
        }

        const correctAnswersCount = quiz.userAnswer.filter((answer) => answer.isCorrect).length;
        const totalQuestions = quiz.userAnswer.length;

        let icon = null;
        let tooltipTitle = "";

        if (correctAnswersCount === totalQuestions) {
            icon = <CheckCircleOutlined sizes="large" style={{ color: "green", marginRight: "8px" }} size={110} />;
            tooltipTitle = `Все задания выполнены верно (${correctAnswersCount}/${totalQuestions})`;
        } else if (correctAnswersCount === 0) {
            icon = <CloseCircleOutlined style={{ color: "red", marginRight: "8px" }} size={111} />;
            tooltipTitle = `Все задания выполнены неверно (0/${totalQuestions})`;
        } else {
            icon = <ExclamationCircleOutlined style={{ color: "orange", marginRight: "8px" }} size={111} />;
            tooltipTitle = `Часть заданий выполнена верно (${correctAnswersCount}/${totalQuestions})`;
        }

        return (
            <Tooltip title={tooltipTitle} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                {icon}
            </Tooltip>
        );
    };

    return (
        <div className="quiz-container mb-6 transition-transform">

            <div className="flex flex-col items-center mb-4">
                <h3 className="text-2xl font-bold">{title}</h3>
                <h6 className="text-gray-600 mb-4">{description}</h6>
            </div>


            <div className="question mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex">
                        {renderIconCountAnswerUser(quiz)}
                        <h4 className="text-lg font-semibold">{`Вопрос ${currentQuestionIndex + 1}: ${currentQuestion.question}`}</h4>
                    </div>


                    {quiz.userAnswer && (
                        <Button
                            onClick={handleRetryQuiz}
                            type="default"
                            disabled
                            className="hover:scale-105"
                        >
                            Попробовать еще раз
                        </Button>
                    )}
                </div>
                <div className="options space-y-3">
                    {currentQuestion.options.map((option: string, index: number) => {
                        const userSelectedIndex = quiz.userAnswer ? quiz.userAnswer[currentQuestionIndex]?.userAnswer : null;
                        const isCorrectAnswer = quiz.userAnswer ? quiz.userAnswer[currentQuestionIndex]?.isCorrect : null;

                        const isSelected = selectedAnswers[currentQuestionIndex] === index;
                        const isUserAnswer = userSelectedIndex === index;
                        const isCorrect = isUserAnswer && isCorrectAnswer;
                        const isWrong = isUserAnswer && !isCorrectAnswer;

                        // Define styles
                        const baseStyle = "border rounded-lg p-4 cursor-pointer transition duration-200";
                        const completedStyle = isCorrect
                            ? "bg-green-100 border-green-500"
                            : isWrong
                                ? "bg-red-100 border-red-500"
                                : "bg-gray-50 border-gray-300";

                        const activeStyle = isSelected ? "bg-blue-100 border-blue-500" : "bg-gray-50 border-gray-300";

                        // Apply completedStyle if user has answered
                        const finalStyle = quiz.userAnswer ? completedStyle : activeStyle;

                        return (
                            <div
                                key={index}
                                className={`${baseStyle} ${finalStyle}`}
                                onClick={() => !quiz.userAnswer && handleOptionChange(index)}
                            >
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestionIndex}`}
                                        value={index}
                                        checked={isUserAnswer || isSelected}
                                        onChange={() => handleOptionChange(index)} // Добавлен обработчик
                                        disabled={!!quiz.userAnswer && retryDisabled}
                                        className="mr-2"
                                    />
                                    {option}
                                </label>
                            </div>
                        );

                    })}
                </div>
            </div>

            <div className="navigation mt-4">
                {currentQuestionIndex !== 0 && (
                    <Button onClick={handleBack} type="default" className="mr-2 hover:scale-105">
                        Назад
                    </Button>
                )}
                {currentQuestionIndex !== questions.length - 1 && (
                    <Button onClick={handleNext} type="default" className="hover:scale-105">
                        Далее
                    </Button>
                )}
                {currentQuestionIndex === questions.length - 1 && (
                    <Button
                        onClick={handleCheckResult}
                        disabled={disabledCheckResultBtn}
                        type="primary"
                        className="hover:scale-105"
                    >
                        Завершить
                    </Button>
                )}
            </div>
        </div>
    );
});
