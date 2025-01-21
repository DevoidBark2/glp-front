import { observer } from "mobx-react";
import React, {FC, useEffect, useRef, useState} from "react";
import { CourseComponentTypeI } from "@/shared/api/course/model";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import {MathfieldElement} from "mathlive";
import {Button} from "antd";


interface QuizMultiComponentProps {
    task: CourseComponentTypeI;
    currentSection: number;
}

export const SimpleTask: FC<QuizMultiComponentProps> = observer(({ task, currentSection }) => {
    const parseDescription = (description: string) => {
        const regex = /\\\{(.*?)\\\}/g;

        const parsedParts: JSX.Element[] = [];
        let lastIndex = 0;

        description.replace(regex, (match, formula, offset) => {
            if (lastIndex < offset) {
                parsedParts.push(
                    <span key={`text-${lastIndex}`} style={{display: "flex", alignItems: "center"}}>
                        {description.slice(lastIndex, offset)}
                    </span>
                );
            }

            parsedParts.push(
                <MathJax key={`formula-${offset}`} style={{marginLeft: 10}}>
                    {formula}
                </MathJax>
            );

            lastIndex = offset + match.length;
            return match;
        });

        // Добавляем оставшийся текст
        if (lastIndex < description.length) {
            parsedParts.push(
                <span key={`text-${lastIndex}`} style={{display: "flex", alignItems: "center"}}>
                    {description.slice(lastIndex)}
                </span>
            );
        }

        return parsedParts;
    };
    const mathFieldRef = useRef<MathfieldElement | null>(null);
    const [formula, setFormula] = useState<string>("");

    const handleFormulaInput = (e: any): void => {
        const target = e.target as MathfieldElement;
        const formulaValue = target.getValue();
        setFormula(formulaValue);
    };

    useEffect(() => {
        import("mathlive").then(() => {
            if (mathFieldRef.current) {
                mathFieldRef.current.setValue(formula);
            }
        });
    }, [formula]);

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
                <div className="bg-[#fff] p-2 border rounded border-[#ddd] mb-4 text-lg text-[#444]">
                    {parseDescription(task.title)}
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
                    onInput={handleFormulaInput}
                ></math-field>
            </MathJaxContext>

            <Button className="mt-4" type="primary">Завершить</Button>
        </div>
    );
});
