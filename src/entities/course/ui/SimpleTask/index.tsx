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
    const { resolvedTheme } = useTheme()

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
    }, [task.title, isEditable]);

    const handleCheckResult = async () => {
        if (onCheckResult)
            await onCheckResult(task, mathFieldRef.current?.value!);
    };

    return (
        <div>
            <h1 className="text-[#333] font-bold text-2xl mb-2 dark:text-white">Решите задачу</h1>
            <p className="text-[#666] text-sm mb-4 dark:text-white">
                Внимательно прочитайте условие и найдите результат. Убедитесь, что вы понимаете формулы и вычисления.
            </p>

            <MathJaxContext
                config={{
                    tex: {
                        tex: {
                            inlineMath: [['$', '$'], ['\\(', '\\)']]
                        },
                        processEscapes: true,
                    },
                    options: {
                        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'], // Пропускаем эти теги
                        renderActions: {
                            addMenu: [],
                        },
                    },
                    "HTML-CSS": {
                        availableFonts: ["STIX"],
                        preferredFont: "STIX",
                        webFont: "STIX-Web",
                    },
                    showMathMenu: false, // Отключаем меню
                    showProcessingMessages: false, // Отключаем сообщения
                }}
            >
                <div className="p-2 border-[#ddd] mb-4 text-lg text-[#444] dark:text-white flex items-center flex-wrap gap-10">
                    {parseMathFormula(task.title)}
                </div>
                <math-field
                    ref={mathFieldRef}
                    //disabled={!isEditable}
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


            <Button className="mt-4" color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"} onClick={handleCheckResult} disabled={!isEditable}>
                Завершить
            </Button>

            {currentAnswer && (
                <Button
                    className="mt-4 ml-2"
                    color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
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
