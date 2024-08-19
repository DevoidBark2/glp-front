"use client";
import {
    Breadcrumb,
    Button,
    Card,
    Form,
    Input,
    message,
    Steps,
    Upload,
    Modal,
    Divider, List, Badge, Table, type TableColumnsType,
} from "antd";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
    ClockCircleOutlined,
    UploadOutlined,
    PlusOutlined, DeleteOutlined
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import {Section} from "@jridgewell/trace-mapping";

const SectionAddPage = () => {
    const { courseStore } = useMobxStores();
    const [createSectionForm] = Form.useForm();
    const [current, setCurrent] = useState(2);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        type: "",
        options: [],
        correctAnswers: [],
        file: null,
        code: "",
        sequence: [],
        matching: [],
        languages: '',
        questions: [{ question: '', options: [''], correctOption: null }],
    });
    const handleTypeChange = (value) => {
        setNewTask({ ...newTask, type: value });
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

    const handleLanguageChange = (value:string) => {
        setNewTask({ ...newTask, languages: value });
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
    const handleSelectCourse = (courseId: number) => {
        setSelectedCourseId(courseId);
        createSectionForm.setFieldsValue({ course: courseId });
    };

    const columns: TableColumnsType<Section> = [
        {
            title: "Название",
            dataIndex: ""
        }
    ]

    const steps = [
        {
            title: "Выбор курса",
            content: (
                <Form.Item
                    name="course"
                >
                    <List
                        grid={{ gutter: 16, column: 6 }}
                        dataSource={courseStore.teacherCourses}
                        renderItem={(item) => (
                            <List.Item>
                                <Badge text={item.status}>
                                    <Card
                                        key={item.id}
                                        title={item.name}
                                        hoverable
                                        onClick={() => handleSelectCourse(item.id)}
                                        style={{
                                            width: 240,
                                            margin: 8,
                                            border: selectedCourseId === item.id ? '2px solid #1890ff' : '2px solid #f0f0f0',
                                            backgroundColor: selectedCourseId === item.id ? '#e6f7ff' : '#fff',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <Card.Meta
                                            description={
                                                <div>
                                                    <p><ClockCircleOutlined /> {item.duration} ч.</p>
                                                    <p>Категория: {item.category.name}</p>
                                                    <p>Уровень: {item.level}</p>
                                                    <p>Дата публикации: {new Date(item.publish_date).toLocaleDateString()}</p>
                                                </div>
                                            }
                                            style={{ textAlign: 'left' }}
                                        />
                                    </Card>
                                </Badge>
                            </List.Item>
                        )}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Информация о разделе",
            content: (
                <>
                    <Form.Item
                        name="name"
                        label="Название раздела"
                        rules={[{required: true, message: "Введите название раздела"}]}
                    >
                        <Input placeholder="Введите название раздела..."/>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Описание раздела"
                        rules={[{required: true, message: "Введите описание раздела"}]}
                    >
                        <TextArea
                            placeholder="Введите описание раздела..."
                            autoSize={{minRows: 3, maxRows: 6}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="uploadFile"
                        label="Дополнительные материалы"
                        tooltip="Загрузите дополнительные материалы (PDF, документы и т.д.)"
                    >
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined/>}>Загрузить файл</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Ссылки на внешние ресурсы"
                        tooltip="Добавьте ссылки на связанные внешние ресурсы"
                    >
                        <Form.List name="externalLinks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="flex items-center mb-4">
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                rules={[{ type: 'url', message: 'Введите корректный URL' }]}
                                                style={{ flexGrow: 1 }}
                                            >
                                                <Input placeholder="Введите URL" />
                                            </Form.Item>
                                            <Button
                                                type="link"
                                                onClick={() => remove(name)}
                                                icon={<DeleteOutlined />}
                                                danger
                                            />
                                        </div>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '100%' }}
                                            icon={<PlusOutlined />}
                                        >
                                            Добавить ссылку
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                </>
            ),
        },
        {
            title: "Содержимое раздела",
            content: (
                <div className="flex">
                   <div className="w-1/4"> <Input placeholder="Введите название или тег..."/></div>
                  <div className="w-3/4 ml-5">
                      <Table columns={columns}/>
                  </div>
                </div>
            ),
        },
        {
            title: "Предпросмотр",
            content: (
                <>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Предварительный просмотр
                    </Button>
                    <Modal
                        title="Предварительный просмотр секции"
                        visible={isModalVisible}
                        onOk={() => setIsModalVisible(false)}
                        onCancel={() => setIsModalVisible(false)}
                        footer={[
                            <Button key="back" onClick={() => setIsModalVisible(false)}>
                                Закрыть
                            </Button>,
                            <Button key="submit" type="primary" onClick={() => setIsModalVisible(false)}>
                                Подтвердить
                            </Button>,
                        ]}
                    >
                        <Divider>Название секции</Divider>
                        <p>{createSectionForm.getFieldValue("name")}</p>
                        <Divider>Описание секции</Divider>
                        <p>{createSectionForm.getFieldValue("sectionDescription")}</p>
                        <Divider>Дата публикации</Divider>
                        <p>{createSectionForm.getFieldValue("publishDate")?.format("YYYY-MM-DD HH:mm:ss")}</p>
                        <Divider>Уровень доступа</Divider>
                        <p>{createSectionForm.getFieldValue("accessLevel")}</p>
                        <Divider>Загруженные файлы и ссылки</Divider>
                        <p>{createSectionForm.getFieldValue("multimediaLinks")}</p>
                    </Modal>
                </>
            ),
        },
    ];

    const next = async () => {
        if(current === 0 && !selectedCourseId) {
            message.warning("Выберите курс!")
            return;
        }

        if (current === 1) {
            await createSectionForm.validateFields(["name", "description"]);
            setCurrent(current + 1);
        } else {
            setCurrent(current + 1);
        }
    };
    const prev = () => setCurrent(current - 1);

    const onFinish = (values: any) => {
        debugger
        const valuesItem =createSectionForm.getFieldsValue(true)
        message.success("Секция успешно добавлена!");
        router.push("/control_panel/sections");
    };

    useEffect(() => {
        courseStore.getCoursesForCreator();
    }, []);

    return (
        <div className="bg-white h-full p-5 overflow-y-auto">
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control_panel/sections"}>Разделы</Link>,
                    },
                    {
                        title: <span>Новый раздел</span>,
                    },
                ]}
            />
            <h1 className="text-center text-3xl mb-5">Добавление нового раздела</h1>
            <Form form={createSectionForm} onFinish={onFinish} layout="vertical">
                <Steps current={current}>
                    {steps.map((item) => (
                        <Steps.Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content mt-5">{steps[current].content}</div>
                <div className="steps-action mt-5 flex justify-end">
                    {current > 0 && (
                        <Button style={{ marginRight: 8 }} onClick={() => prev()}>
                            Назад
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Далее
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                            Подтвердить и создать
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default observer(SectionAddPage);
