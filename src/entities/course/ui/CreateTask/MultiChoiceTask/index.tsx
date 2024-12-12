import { FC } from "react";
import { Button, Checkbox, Col, Form, FormInstance, Input, Row, Select, Tag } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface MultiPlayChoiceProps {
    form: FormInstance;
}

export const MultiPlayChoice: FC<MultiPlayChoiceProps> = ({ form }) => {
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
                    options={[]}
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
                                style={{
                                    marginBottom: 16,
                                    padding: 10,
                                    border: "1px solid #d9d9d9",
                                    borderRadius: 4,
                                }}
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
                                                                rules={[
                                                                    { required: true, message: "Введите вариант ответа" },
                                                                ]}
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
                                    label="Правильный ответ(ы)"
                                    name={[name, "correctOptions"]}
                                    rules={[
                                        { required: true, message: "Пожалуйста, выберите правильный ответ(ы)" },
                                    ]}
                                >
                                    <Checkbox.Group>
                                        <div className="flex flex-col">
                                            {form
                                                .getFieldValue(["questions", qIndex, "options"])
                                                ?.map((option: string, index: number) => (
                                                    <Checkbox key={index} value={index}>
                                                        <div className="option-box">
                                                            <span className="option-text">{option}</span>
                                                        </div>
                                                    </Checkbox>
                                                ))}
                                        </div>
                                    </Checkbox.Group>
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

                        {fields.length === 0 && (
                            <Button
                                className="mb-4"
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => add()}
                            >
                                Добавить вопрос
                            </Button>
                        )}
                    </>
                )}
            </Form.List>
        </>
    );
};