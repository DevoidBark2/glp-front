"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import "mathlive";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const { TextArea } = Input;
const { Title } = Typography;

const TaskWithFormula = () => {
  const [taskDescription, setTaskDescription] = useState(""); // Описание задачи
  const [formula, setFormula] = useState(""); // Формула задачи
  const [taskSolution, setTaskSolution] = useState(""); // Решение задачи

  // Ссылка для управления компонентом MathLive
  const mathFieldRef = useRef(null);

  const handleFormulaInput = (e: any) => {
    // Получаем LaTeX формулу из MathLive
    const formulaValue = e.target.getValue();
    setFormula(formulaValue);

    // После изменения формулы можно попросить MathJax обновиться
    if (window.MathJax) {
      // Используем typesetPromise для асинхронного обновления
      window.MathJax.typesetPromise().catch((err) => console.error("MathJax error:", err));
    }
  };

  const calculateSolution = () => {
    // Пример обработки формулы решения
    try {
      const variables = { a: 3, b: 2 }; // Пример значений для переменных
      const formulaWithVariables = formula.replace(/a/g, variables.a).replace(/b/g, variables.b);
      const result = eval(formulaWithVariables); // Простое вычисление (или используйте безопасный парсер, как math.js)
      setTaskSolution(`Результат: ${result}`);
    } catch (e) {
      setTaskSolution("Ошибка при вычислении. Проверьте формулу.");
    }
  };

  useEffect(() => {
    // Динамический импорт MathLive для работы на клиенте
    import("mathlive").then(() => {
      // После того как MathLive загружен, можно инициализировать его
      if (mathFieldRef.current) {
        mathFieldRef.current.setValue(formula); // Устанавливаем начальное значение формулы, если оно уже есть
      }
    });
  }, [formula]);

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Описание задачи">
          <TextArea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Введите текст задачи. Например, 'Есть 3 яблока и 2 банана. Сколько всего фруктов?'"
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Формула решения задачи">
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
            onInput={handleFormulaInput} // Используем onInput для MathLive
          ></math-field>
          <div style={{ marginTop: "8px", fontStyle: "italic", color: "#888" }}>
            Пример: <strong>a + b</strong>, где a и b — переменные задачи
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={calculateSolution}>
            Рассчитать решение
          </Button>
        </Form.Item>
      </Form>

      <Divider />

{formula}
      {formula && (
        <MathJaxContext>
          <div>
            <Title level={4}>Формула:</Title>
            <MathJax>
              {`\\[${formula}\\]`}  {/* Передаем LaTeX в MathJax */}
            </MathJax>
          </div>
        </MathJaxContext>
      )}

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
