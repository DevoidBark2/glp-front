import { CourseComponentTypeI } from "@/shared/api/course/model";
import { useMobxStores } from "@/stores/stores";
import { Button } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizMultiComponentProps {
    quiz: CourseComponentTypeI,
    currentSection: number
}

export const QuizMultiComponent = observer(({ quiz, currentSection }: QuizMultiComponentProps) => {
    const { courseStore } = useMobxStores();
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    const handleOptionChange = (index: number) => {
        setSelectedAnswers((prevAnswers) => {
            if (prevAnswers.includes(index)) {
                return prevAnswers.filter((answer) => answer !== index);
            }
            return [...prevAnswers, index];
        });
    };

    const checkAnswers = () => {
        debugger
        courseStore.handleCheckTask({ task: quiz, answers: selectedAnswers, currentSection: Number(currentSection) })
    };

    return (
        <div className="quiz-component bg-white">
            {quiz.title && <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{quiz.title}</h2>}
            {quiz.description && <p className="text-gray-600 mb-4 text-center">{quiz.description}</p>}

            {quiz.questions.map((questionItem, questionIndex) => (
                <div key={questionIndex} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Вопрос: {questionItem.question}</h3>

                    <div className="options">
                        {questionItem.options.map((option, optionIndex) => (
                            <label
                                key={optionIndex}
                                className={`block cursor-pointer mb-2 p-4 border rounded-lg transition-all ${selectedAnswers.includes(optionIndex)
                                    ? 'bg-blue-100 border-blue-500'
                                    : 'bg-white border-gray-300'
                                    }`}
                            >
                                <input
                                    type="checkbox"
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
            ))}

            <div className="flex justify-end">
                <Button
                    type="primary"
                    onClick={checkAnswers}
                    className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
                >
                    Завершить
                </Button>
            </div>
        </div>
    );
})