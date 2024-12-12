import { Button, Col, Form, Input, Row, Select, Tag } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FC } from "react";
import { FormInstance } from "antd/lib";
import { v4 as uuidv4 } from 'uuid';

interface QuizTaskProps {
    form: FormInstance;
}

export const QuizTask: FC<QuizTaskProps> = ({ form }) => {
    return (
        <>
            <Form.Item label="Заголовок" name="title">
                <Input placeholder="Введите заголовок" />
            </Form.Item>

            <Form.Item
                name="tags"
                label="Теги"
                rules={[{ required: true, message: "Пожалуйста, добавьте хотя бы один тег!" }]}
            >
                <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Введите тег и нажмите Enter"
                    tagRender={({ label, closable, onClose }) => (
                        <Tag closable={closable} onClose={onClose} style={{ margin: 2 }}>
                            {label}
                        </Tag>
                    )}
                />
            </Form.Item>

            <Form.Item label="Описание компонента" name="description">
                <Input.TextArea placeholder="Введите описание компонента" />
            </Form.Item>

            <Form.List name={["questions"]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, qIndex) => (
                            <div
                                key={key}
                                style={{ marginBottom: 16, padding: 10, border: "1px solid #d9d9d9", borderRadius: 4 }}
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, "question"]}
                                    label={`Вопрос ${qIndex + 1}`}
                                    rules={[{ required: true, message: "Введите вопрос" }]}
                                >
                                    <Input placeholder="Введите вопрос" />
                                </Form.Item>

                                <Form.List name={[name, "options"]}>
                                    {(optionFields, { add: addOption, remove: removeOption }) => (
                                        <>
                                            {optionFields.map((optionField, oIndex) => {
                                                const { key, ...fieldProps } = optionField;
                                                return (
                                                    <Row gutter={8} align="stretch" key={key}>
                                                        <Col flex="auto">
                                                            <Form.Item
                                                                {...fieldProps}
                                                                name={[optionField.name]}
                                                                rules={[{ required: true, message: "Введите вариант ответа" }]}
                                                            >
                                                                <Input placeholder={`Вариант ответа ${oIndex + 1}`} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="text"
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => removeOption(optionField.name)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                );
                                            })}
                                            <Button
                                                type="dashed"
                                                className="mb-4"
                                                icon={<PlusOutlined />}
                                                onClick={() => addOption()}
                                                style={{ marginTop: 8 }}
                                            >
                                                Добавить вариант ответа
                                            </Button>
                                        </>
                                    )}
                                </Form.List>

                                <Form.Item
                                    label="Правильный ответ"
                                    name={[name, "correctOption"]}
                                    rules={[{ required: true, message: 'Пожалуйста, выберите правильный ответ' }]}
                                >
                                    <Select placeholder="Выберите правильный ответ">
                                        {form.getFieldValue(['questions', qIndex, 'options'])?.map((option: string, index: number) => (
                                            <Select.Option key={index} value={index}>
                                                {option}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Button
                                    type="link"
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)}
                                    style={{ marginTop: 8 }}
                                >
                                    Удалить вопрос
                                </Button>
                            </div>
                        ))}
                        <Button
                            className="mb-4"
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() =>
                                add({
                                    id: uuidv4(), // Генерация уникального id для нового вопроса
                                    question: '',
                                    options: [],
                                    correctOption: null,
                                })
                            }
                        >
                            Добавить вопрос
                        </Button>
                    </>
                )}
            </Form.List>
        </>
    );
};