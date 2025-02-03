import { observer } from "mobx-react";
import React, {FC, useEffect, useRef, useState} from "react";
import { CourseComponentTypeI } from "@/shared/api/course/model";
import { MathJaxContext } from "better-react-mathjax";
import { MathfieldElement } from "mathlive";
import { Button } from "antd";
import { parseMathFormula } from "@/shared/lib/parseMathFormula";

interface QuizMultiComponentProps {
    task: CourseComponentTypeI;
    onCheckResult: (quiz: CourseComponentTypeI, answers: number[] | string) => Promise<void>;
}

export const SimpleTask: FC<QuizMultiComponentProps> = observer(({ task, onCheckResult }) => {
    const mathFieldRef = useRef<MathfieldElement | null>(null);
    const [isEditable, setIsEditable] = useState(!task.userAnswer);
    const [currentAnswer, setCurrentAnswer] = useState(task.userAnswer || null);

    useEffect(() => {
        if (mathFieldRef.current && currentAnswer) {
            if (typeof currentAnswer === "object" && !Array.isArray(currentAnswer) && "userAnswer" in currentAnswer) {
                mathFieldRef.current.value = currentAnswer.userAnswer.toString();
            }
        }
    }, [currentAnswer]);

    useEffect(() => {
        const typesetMath = async () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise();
            }
        };
        typesetMath();
    }, [task.title,isEditable]);

    const handleCheckResult = async () => {
        await onCheckResult(task, mathFieldRef.current?.value!);
    };

    return (
        <div>
            <h1 className="text-[#333] font-bold text-2xl mb-2">Решите задачу</h1>
            <p className="text-[#666] text-sm mb-4">
                Внимательно прочитайте условие и найдите результат. Убедитесь, что вы понимаете формулы и вычисления.
            </p>

            <MathJaxContext>
                <div className="bg-[#fff] p-2 border rounded border-[#ddd] mb-4 text-lg text-[#444] flex items-center flex-wrap">
                    {parseMathFormula(task.title)}
                </div>
                <math-field
                    ref={mathFieldRef}
                    disabled={!isEditable}
                    style={{
                        width: "100%",
                        fontSize: "1.2rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                        boxShadow: "inset 0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                    virtual-keyboard-mode="onfocus"
                ></math-field>
            </MathJaxContext>


            <Button className="mt-4" type="primary" onClick={handleCheckResult} disabled={!isEditable}>
                Завершить
            </Button>

            {currentAnswer && (
                <Button
                    className="mt-4 ml-2"
                    type="primary"
                    onClick={() => {
                        setIsEditable(true);
                        // setCurrentAnswer(null); // Сбрасываем сохраненный ответ, чтобы поле можно было редактировать
                        // if (mathFieldRef.current) {
                        //     mathFieldRef.current.value = ""; // Очищаем поле
                        // }
                    }}
                >
                    Попробовать еще раз
                </Button>
            )}
        </div>
    );
});
