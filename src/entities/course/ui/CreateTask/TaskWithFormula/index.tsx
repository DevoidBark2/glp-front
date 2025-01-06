"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import "mathlive";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const { TextArea } = Input;
const { Title } = Typography;

const TaskWithFormula = () => {
  const [taskDescription, setTaskDescription] = useState(""); // Описание задачи
  const [variables, setVariables] = useState({}); // Входные переменные задачи
  const [formula, setFormula] = useState(""); // Формула задачи
  const [taskSolution, setTaskSolution] = useState(""); // Решение задачи

  // Ссылка для управления компонентом MathLive (для формулы)
  const mathFieldRef = useRef(null);

  // Ссылка для MathLive в описании задачи
  const descriptionMathFieldRef = useRef(null);

  const handleFormulaInput = (e) => {
    // Получаем LaTeX формулу из MathLive
    const formulaValue = e.target.getValue();
    setFormula(formulaValue);

    // После изменения формулы можно попросить MathJax обновиться
    if (window.MathJax) {
      window.MathJax.typesetPromise().catch((err) =>
        console.error("MathJax error:", err)
      );
    }
  };

  const handleDescriptionInput = (e) => {
    // Обновление описания задачи из MathLive
    const descriptionValue = e.target.getValue();
    setTaskDescription(descriptionValue);

    if (window.MathJax) {
      window.MathJax.typesetPromise().catch((err) =>
        console.error("MathJax error:", err)
      );
    }
  };

  useEffect(() => {
    // Динамический импорт MathLive для работы на клиенте
    import("mathlive").then(() => {
      if (mathFieldRef.current) {
        mathFieldRef.current.setValue(formula);
      }
      if (descriptionMathFieldRef.current) {
        descriptionMathFieldRef.current.setValue(taskDescription);
      }
    });
  }, [formula, taskDescription]);

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Описание задачи (можно вставлять формулы в формате MathLax)">
          <TextArea />
        </Form.Item>

        <Form.Item label="Формула в формате MathLax">
          <math-field
            ref={mathFieldRef}
            style={{
              width: "100%",
              fontSize: "1.2rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
            }}
            virtual-keyboard-mode="onfocus"
            onInput={handleFormulaInput}
          ></math-field>
        </Form.Item>
      </Form>

      <Divider />


{formula}
      <MathJaxContext>
        {taskDescription && (
          <div>
            <Title level={4}>Предпросмотр задачи:</Title>
            <MathJax>{`\\[${taskDescription}\\]`}</MathJax>
          </div>
        )}

        {formula && (
          <div>
            <Title level={4}>Формула:</Title>
            <MathJax>{`\\[${formula}\\]`}</MathJax>
          </div>
        )}
      </MathJaxContext>

      {taskSolution && (
        <div>
          <Title level={4}>Результат:</Title>
          <p>{taskSolution}</p>
        </div>
      )}
    </>
  );
};

export default TaskWithFormula;
