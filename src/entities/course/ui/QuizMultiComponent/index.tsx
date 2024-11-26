import { CourseComponentTypeI } from "@/shared/api/course/model";
import { observer } from "mobx-react";
import { useState } from "react";

interface QuizMultiComponentProps {
    quiz: CourseComponentTypeI
}

export const QuizMultiComponent = observer(({quiz} :QuizMultiComponentProps) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const handleOptionChange = (index: number) => {
        setSelectedAnswers((prevAnswers) => {
            if (prevAnswers.includes(index)) {
                return prevAnswers.filter((answer) => answer !== index);
            }
            return [...prevAnswers, index];
        });
    };

    const checkAnswers = () => {
        setShowResults(true);
    };

    return (
        <div className="quiz-component bg-white p-6 rounded-lg shadow-md">
            {quiz.title && <h2 className="text-2xl font-bold mb-4 text-gray-800">{quiz.title}</h2>}
            {quiz.description && <p className="text-gray-600 mb-4">{quiz.description}</p>}

            {quiz.questions.map((questionItem, questionIndex) => (
                <div key={questionIndex} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{questionItem.question}</h3>

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

            <button
                onClick={checkAnswers}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
            >
                Check Answers
            </button>

            {showResults && (
                <div className="mt-6">
                    {quiz.questions.map((questionItem, questionIndex) => (
                        <div key={questionIndex} className="mb-4">
                            <h4 className="text-lg font-medium text-gray-800">{questionItem.question}</h4>
                            {questionItem.options.map((option, optionIndex) => {
                                const isCorrect = questionItem.correctOptions.includes(optionIndex);
                                const isSelected = selectedAnswers.includes(optionIndex);
                                const className = isCorrect
                                    ? 'text-green-600'
                                    : isSelected && !isCorrect
                                        ? 'text-red-600'
                                        : 'text-gray-800';

                                return (
                                    <p key={optionIndex} className={`mt-2 ${className}`}>
                                        {option} {isCorrect && '(Correct)'}
                                        {isSelected && !isCorrect && '(Your answer)'}
                                    </p>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
})