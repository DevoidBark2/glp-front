import { observer } from "mobx-react";
import React, { FC, useEffect, useRef, useState } from "react";
import { ComponentTask } from "@/shared/api/course/model";
import { MathJaxContext } from "better-react-mathjax";
import { MathfieldElement } from "mathlive";
import { Button } from "antd";
import { parseMathFormula } from "@/shared/lib/parseMathFormula";
import { useTheme } from "next-themes";

interface QuizMultiComponentProps {
    task: ComponentTask;
    onCheckResult?: (quiz: ComponentTask, answers: string) => Promise<void>;
}

export const SimpleTask: FC<QuizMultiComponentProps> = observer(({ task, onCheckResult }) => {
    const mathFieldRef = useRef<MathfieldElement | null>(null);
    const [isEditable, setIsEditable] = useState(!task.userAnswer);
    const [currentAnswer, setCurrentAnswer] = useState(task.userAnswer || null);
    const { resolvedTheme } = useTheme();

    // Обновляем поле, если есть сохраненный ответ
    useEffect(() => {
        if (mathFieldRef.current && currentAnswer) {
            mathFieldRef.current.setValue(currentAnswer.answer[0].userAnswer.toString());
            setIsEditable(false);
        }
    }, [currentAnswer]);

    // Обновляем MathJax при изменении условий задачи
    useEffect(() => {
        const typesetMath = async () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise();
            }
        };
        typesetMath();
    }, [task.title, isEditable]);

    // Обновляем `disabled` у math-field при изменении `isEditable`
    useEffect(() => {
        if (mathFieldRef.current) {
            if (isEditable) {
                mathFieldRef.current.removeAttribute("disabled");
            } else {
                mathFieldRef.current.setAttribute("disabled", "true");
            }
        }
    }, [isEditable]);

    const handleCheckResult = async () => {
        if (onCheckResult && mathFieldRef.current) {
            const userAnswer = mathFieldRef.current.getValue();
            await onCheckResult(task, userAnswer);

            // Обновляем ответ пользователя
            setCurrentAnswer({
                answer: [{ userAnswer }],
            });

            setIsEditable(false); // Делаем поле нередактируемым
        }
    };

    const handleRetry = () => {
        setCurrentAnswer(null);
        setIsEditable(true);
        if (mathFieldRef.current) {
            mathFieldRef.current.setValue(""); // Очищаем поле
        }
    };

    return (
        <div>
            <h1 className="text-[#333] font-bold text-2xl mb-2 dark:text-white">Решите задачу</h1>
            <p className="text-[#666] text-sm mb-4 dark:text-white">
                Внимательно прочитайте условие и найдите результат. Убедитесь, что вы понимаете формулы и вычисления.
            </p>

            <MathJaxContext>
                <div className="p-2 border-[#ddd] mb-4 text-lg text-[#444] dark:text-white flex items-center flex-wrap gap-10">
                    {parseMathFormula(task.title)}
                </div>
            </MathJaxContext>

            <math-field
                ref={mathFieldRef}
                style={{
                    width: "100%",
                    fontSize: "1.2rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                }}
            ></math-field>

            <Button className="mt-4" onClick={handleCheckResult} disabled={!isEditable}>
                Завершить
            </Button>

            {currentAnswer && (
                <Button className="mt-4 ml-2" onClick={handleRetry}>
                    Попробовать еще раз
                </Button>
            )}
        </div>
    );
});
