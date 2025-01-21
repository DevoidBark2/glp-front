import { observer } from "mobx-react";
import React, { FC, useEffect, useRef, useState } from "react";
import { CourseComponentTypeI } from "@/shared/api/course/model";
import { MathJaxContext } from "better-react-mathjax";
import { MathfieldElement } from "mathlive";
import { Button } from "antd";
import { useMobxStores } from "@/shared/store/RootStore";
import { parseMathFormula } from "@/shared/lib/parseMathFormula";


interface QuizMultiComponentProps {
    task: CourseComponentTypeI;
    currentSection: number;
}

export const SimpleTask: FC<QuizMultiComponentProps> = observer(({ task, currentSection }) => {
    const { courseStore } = useMobxStores()
    const mathFieldRef = useRef<MathfieldElement | null>(null);

    const handleCheckAnswer = () => {
        courseStore.handleCheckTask({ task: task, answers: mathFieldRef.current?.value!, currentSection: Number(currentSection) })
    }

    useEffect(() => {
        const typesetMath = async () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                await window.MathJax.typesetPromise();
            }
        };
        typesetMath();
    }, [task.title]);

    return (
        <div>
            <h1 className="text-[#333] font-bold text-2xl mb-2">
                Решите задачу
            </h1>
            <p className="text-[#666] text-sm mb-4">
                Внимательно прочитайте условие и найдите результат. Убедитесь, что вы
                понимаете формулы и вычисления.
            </p>
            <MathJaxContext>
                <div className="bg-[#fff] p-2 border rounded border-[#ddd] mb-4 text-lg text-[#444] flex items-center">
                    {parseMathFormula(task.title)}
                </div>
                <math-field
                    ref={mathFieldRef}
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

            <Button className="mt-4" type="primary" onClick={handleCheckAnswer}>Завершить</Button>
        </div>
    );
});
