"use client";
import React, { useEffect, useRef, useState } from "react";
import {Divider, Form, FormInstance, Input} from "antd";
import { MathfieldElement } from "mathlive";
import { MathJaxContext } from "better-react-mathjax";

const { TextArea } = Input;


interface TaskWithFormulaProps {
  form?: FormInstance;
}

export const TaskWithFormula: React.FC<TaskWithFormulaProps> = ({form}) => {
  const [formula, setFormula] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const mathFieldRef = useRef<MathfieldElement | null>(null);

  const handleFormulaInput = (e: any): void => {
    const target = e.target as MathfieldElement;
    const formulaValue = target.getValue();
    setFormula(formulaValue);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    setTaskDescription(value);
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
      </MathJaxContext>
  );
};
