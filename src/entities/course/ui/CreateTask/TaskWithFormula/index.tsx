"use client";
import React, { useEffect, useRef, useState } from "react";
import {Divider, Form, FormInstance, Input} from "antd";
import { MathfieldElement } from "mathlive";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const { TextArea } = Input;


interface TaskWithFormulaProps {
  form?: FormInstance;
}

const TaskWithFormula: React.FC<TaskWithFormulaProps> = ({form}) => {
  const [formula, setFormula] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [parsedDescription, setParsedDescription] = useState<JSX.Element[]>([]);

  const mathFieldRef = useRef<MathfieldElement | null>(null);

  const handleFormulaInput = (e: any): void => {
    const target = e.target as MathfieldElement;
    const formulaValue = target.getValue();
    setFormula(formulaValue);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    setTaskDescription(value);

    const parsed = parseDescription(value);
    setParsedDescription(parsed);
  };

  const parseDescription = (description: string) => {
    // Регулярное выражение для поиска формул внутри \{...\}
    const regex = /\\\{[\s\S]*?\\\}/g;

    // Находим все совпадения: формулы и обычные текстовые блоки
    const parts = description.split(regex);

    // Находим сами формулы отдельно
    const formulas = description.match(regex) || [];

    // Итоговый массив (объединяем текст и формулы)
    const parsedParts: JSX.Element[] = [];
    let formulaIndex = 0;

    parts.forEach((part, index) => {
      // Добавляем текстовые блоки
      if (part.trim() !== "") {
        parsedParts.push(<span key={`text-${index}`}>{part}</span>);
      }

      // Если есть формула в текущей позиции, добавляем её
      if (formulaIndex < formulas.length) {
        const formula = formulas[formulaIndex];
        parsedParts.push(
            <MathJax key={`formula-${formulaIndex}`}>
              {formula}
            </MathJax>
        );
        formulaIndex++;
      }
    });

    return parsedParts;
  };

  useEffect(() => {
    import("mathlive").then(() => {
      if (mathFieldRef.current) {
        mathFieldRef.current.setValue(formula);
      }
    });
  }, [formula]);

  return (
      <MathJaxContext>
          <Form.Item
              name="title"
              label="Заголовок"
              tooltip="Введите заголовок задачи."
              rules={[{required: true, message: "Введите описание задачи!"}]}
          >
              <TextArea
                  placeholder="Введите описание задачи"
                  value={taskDescription}
                  onChange={handleDescriptionChange}
              />
          </Form.Item>
        <Form.Item
            name="description"
            label="Описание"
            tooltip="Введите описание задачи, можно вставлять формулы в формате MathLax."
            rules={[{required: true, message: "Введите описание задачи!"}]}
        >
          <TextArea
              placeholder="Введите описание задачи"
              value={taskDescription}
              onChange={handleDescriptionChange}
          />
        </Form.Item>

        <Form.Item
            tooltip="Вводите формулу в красивом формате, для копирования используйте MathLax."
            label="Формула"
        >
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

        {formula}

        <Divider />

        <Form.Item
            name="answer"
            label="Ответ"
            tooltip="Введите ответ задачи, это может быть число или формула в формате MathLax."
            rules={[{required: true, message: "Введите ответ!"}]}
        >
          <Input placeholder="Введите ответ (например, число или формулу в формате MathLax)" />
        </Form.Item>

        {/*<Divider />*/}

        {/*<Title level={4}>Предпросмотр задачи</Title>*/}
        {/*<div style={{ marginBottom: "16px" }}>*/}
        {/*  <strong>Описание задачи:</strong>*/}
        {/*  <div>{parsedDescription}</div>*/}
        {/*</div>*/}

        {/*<Divider />*/}

        {/*<div>*/}
        {/*  <strong>Формула:</strong>*/}
        {/*  <MathJax>{`\\(${formula}\\)`}</MathJax>*/}
        {/*</div>*/}
      </MathJaxContext>
  );
};

export default TaskWithFormula;
