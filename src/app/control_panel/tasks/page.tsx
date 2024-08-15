"use client";
import React, { useState } from "react";
import {Button, Card, Col, Form, Input, List, Modal, Row, Select, Upload} from "antd";
import {DeleteOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import CodeMirror from '@uiw/react-codemirror';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/python/python';
// import 'codemirror/mode/java/java';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        type: "text",
        options: [],
        correctAnswers: [],
        file: null,
        code: "",
        sequence: [],
        matching: [],
        questions: [{ question: '', options: [''], correctOption: null }],
    });

    const handleTypeChange = (value) => {
        setNewTask({ ...newTask, type: value });
    };

    const handleFileChange = (info) => {
        if (info.file.status === 'done') {
            setNewTask({ ...newTask, file: info.file.originFileObj });
        }
    };

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' }
    ];

    const handleLanguageChange = (value) => {
        setNewTask({ ...newTask, language: value });
    };

    const handleAddTask = () => {
        setTasks([...tasks, newTask]);
        setNewTask({ title: "", description: "", type: "text" });
        setIsModalVisible(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const addQuestion = () => {
        setNewTask({
            ...newTask,
            questions: [...newTask.questions, { question: '', options: [''], correctOption: null }],
        });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = newTask.questions.filter((_, i) => i !== index);
        setNewTask({ ...newTask, questions: updatedQuestions });
    };

    const addOption = (index) => {
        const updatedQuestions = [...newTask.questions];
        updatedQuestions[index].options.push('');
        setNewTask({ ...newTask, questions: updatedQuestions });
    };

    const removeOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...newTask.questions];
        updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
        setNewTask({ ...newTask, questions: updatedQuestions });
    };

    const handleQuestionChange = (index, key, value) => {
        const updatedQuestions = [...newTask.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
        setNewTask({ ...newTask, questions: updatedQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...newTask.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setNewTask({ ...newTask, questions: updatedQuestions });
    };


    return (
        <div className="bg-white h-full p-5">
            <h1 className="text-center text-2xl mb-5">Задания</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className="mb-5">
                Добавить задание
            </Button>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={tasks}
                renderItem={(task) => (
                    <List.Item>
                        <Card title={task.title}>
                            <p><strong>Тип:</strong> {task.type}</p>
                            <p>{task.description}</p>
                        </Card>
                    </List.Item>
                )}
            />
            <Modal
                title="Новое задание"
                visible={isModalVisible}
                onOk={() => handleAddTask(newTask)}
                onCancel={handleCancel}
                width={800}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Отмена
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleAddTask(newTask)}>
                        Сохранить
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Название задания" required>
                        <Input
                            placeholder="Введите название задания"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Описание задания" required>
                        <Input.TextArea
                            placeholder="Введите описание задания"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Тип задания" required>
                        <Select
                            value={newTask.type}
                            onChange={handleTypeChange}
                        >
                            <Select.Option value="text">Текст</Select.Option>
                            <Select.Option value="quiz">Квиз</Select.Option>
                            <Select.Option value="file">Файл</Select.Option>
                            <Select.Option value="coding">Программирование</Select.Option>
                            <Select.Option value="multiple-choice">Выбор ответа</Select.Option>
                            <Select.Option value="matching">Соответствие</Select.Option>
                            <Select.Option value="sequencing">Последовательность</Select.Option>
                        </Select>
                    </Form.Item>

                    {newTask.type === 'quiz' && (
                        <Form layout="vertical">
                            <Form.Item label="Название задания" required>
                                <Input
                                    placeholder="Введите название задания"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </Form.Item>
                            <Form.Item label="Описание задания" required>
                                <Input.TextArea
                                    placeholder="Введите описание задания"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </Form.Item>
                            {newTask.questions.map((question, qIndex) => (
                                <div key={qIndex} style={{ marginBottom: 16, padding: 10, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                                    <Form.Item label={`Вопрос ${qIndex + 1}`} required>
                                        <Input
                                            placeholder="Введите вопрос"
                                            value={question.question}
                                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Варианты ответов">
                                        {question.options.map((option, oIndex) => (
                                            <Row gutter={8} align="middle" key={oIndex}>
                                                <Col flex="auto">
                                                    <Input
                                                        placeholder={`Вариант ответа ${oIndex + 1}`}
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    />
                                                </Col>
                                                <Col>
                                                    {question.options.length > 1 && (
                                                        <Button
                                                            type="text"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                        />
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={() => addOption(qIndex)}
                                            style={{ marginTop: 8 }}
                                        >
                                            Добавить вариант ответа
                                        </Button>
                                    </Form.Item>
                                    <Form.Item label="Правильный ответ">
                                        <Select
                                            value={question.correctOption}
                                            onChange={(value) => handleQuestionChange(qIndex, 'correctOption', value)}
                                            placeholder="Выберите правильный ответ"
                                        >
                                            {question.options.map((option, index) => (
                                                <Select.Option key={index} value={index}>
                                                    {option}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Button
                                        type="link"
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeQuestion(qIndex)}
                                        style={{ marginTop: 8 }}
                                    >
                                        Удалить вопрос
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={addQuestion}
                            >
                                Добавить вопрос
                            </Button>
                        </Form>
                    )}

                    {newTask.type === 'file' && (
                        <Form.Item label="Файл задания">
                            <Upload
                                name="file"
                                customRequest={handleFileChange}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>Выберите файл</Button>
                            </Upload>
                        </Form.Item>
                    )}

                    {newTask.type === 'coding' && (
                        <>
                            <Form.Item label="Выберите язык программирования" required>
                                <Select
                                    value={newTask.language}
                                    onChange={handleLanguageChange}
                                >
                                    {languages.map(lang => (
                                        <Select.Option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Код задания">
                                <CodeMirror
                                    value={newTask.code}
                                    options={{
                                        mode: newTask.language,
                                        lineNumbers: true,
                                        theme: 'material',
                                    }}
                                    onBeforeChange={(editor, data, value) => {
                                        setNewTask({ ...newTask, code: value });
                                    }}
                                />
                            </Form.Item>
                        </>
                    )}

                    {newTask.type === 'multiple-choice' && (
                        <Form.Item label="Варианты ответов">
                            {/* Implement multiple-choice form elements here */}
                            <Input.TextArea
                                placeholder="Введите варианты ответов"
                                value={newTask.options.join('\n')}
                                onChange={(e) => setNewTask({ ...newTask, options: e.target.value.split('\n') })}
                            />
                            <Form.Item label="Правильные ответы">
                                <Input.TextArea
                                    placeholder="Введите правильные ответы (по одному на строку)"
                                    value={newTask.correctAnswers.join('\n')}
                                    onChange={(e) => setNewTask({ ...newTask, correctAnswers: e.target.value.split('\n') })}
                                />
                            </Form.Item>
                        </Form.Item>
                    )}

                    {newTask.type === 'matching' && (
                        <Form.Item label="Соответствия">
                            {/* Implement matching form elements here */}
                            <Input.TextArea
                                placeholder="Введите пары соответствий"
                                value={newTask.matching.join('\n')}
                                onChange={(e) => setNewTask({ ...newTask, matching: e.target.value.split('\n') })}
                            />
                        </Form.Item>
                    )}

                    {newTask.type === 'sequencing' && (
                        <Form.Item label="Последовательность">
                            {/* Implement sequencing form elements here */}
                            <Input.TextArea
                                placeholder="Введите элементы последовательности"
                                value={newTask.sequence.join('\n')}
                                onChange={(e) => setNewTask({ ...newTask, sequence: e.target.value.split('\n') })}
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default TaskPage;
