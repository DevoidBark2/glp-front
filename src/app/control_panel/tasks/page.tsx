"use client";
import React, {useEffect, useState} from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    TableColumnsType, Tag,
    Tooltip
} from "antd";
import {
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    DeleteOutlined,
    EditOutlined, EyeOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
} from "@ant-design/icons";
import {CourseComponentType} from "@/enums/CourseComponentType";
import Link from "next/link";
import {FILTER_TYPE_COMPONENT_COURSE} from "@/constants";
import {useMobxStores} from "@/stores/stores";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {observer} from "mobx-react";
import {CourseComponentTypeI} from "@/stores/CourseComponent";

const TaskPage = () => {
    const {courseComponentStore} = useMobxStores()

    const [typeTask,setTypeTask] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleTypeChange = (value: string) => {
        setTypeTask(value);
    };

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' }
    ];

    const typeIcons = {
        [CourseComponentType.Text]: <BookOutlined style={{ color: '#1890ff' }} />,
        [CourseComponentType.Quiz]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        [CourseComponentType.Coding]: <CodeOutlined style={{ color: '#ff4d4f' }} />,
        [CourseComponentType.MultiPlayChoice]: <ProjectOutlined style={{ color: '#faad14' }} />,
        [CourseComponentType.Matching]: <ReconciliationOutlined style={{ color: '#2f54eb' }} />,
        [CourseComponentType.Sequencing]: <EditOutlined style={{ color: '#13c2c2' }} />,
    };

    const columns: TableColumnsType<CourseComponentTypeI> = [
        {
            title: 'Название',
            dataIndex: 'title',
            render: (text, record) => (
                <Tooltip title={text ? `Перейти к редактированию: ${text}` : 'Название не указано'}>
                    <Link href={text ? `courses/${record.id}` : '#'} style={{ color: text ? 'blue' : 'grey' }}>
                        {text ? text : 'Название не указано'}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: "Тип",
            dataIndex: "type",
            filters: FILTER_TYPE_COMPONENT_COURSE,
            onFilter: (value, record) => record.type.startsWith(value as string),
            filterSearch: true,
            render: (value, record) => (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                {typeIcons[record.type]}
                    <span style={{ marginLeft: 8 }}>{value}</span>
            </span>
            ),
        },
        {
            title: "Количество вопросов",
            dataIndex: "questions",
            render: (questions) => questions?.length,
        },
        {
            title: "Дата создания",
            dataIndex: "createdAt",
            render: (date) => date ? new Date(date).toLocaleDateString() : 'Не указана',
        },
        {
            title: "Дата обновления",
            dataIndex: "updatedAt",
            render: (date) => date ? new Date(date).toLocaleDateString() : 'Не указана',
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Активен' : 'Неактивен'}
                </Tag>
            ),
        },
        {
            title: "Действия",
            align: 'start',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Tooltip title="Просмотреть содержимое">
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            className="mr-2"
                            onClick={() => {
                                // Обработчик для предварительного просмотра содержимого
                                console.log(`Просмотр содержимого для ${record.id}`);
                            }}
                        >
                            Просмотреть
                        </Button>
                    </Tooltip>
                    <Tooltip title="Редактировать компонент">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            className="mr-2"
                        >
                            <Link href={`tasks/${record.id}`}>
                                Изменить
                            </Link>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Удалить курс">
                        <Popconfirm
                            title="Удалить курс?"
                            description="Вы уверены, что хотите удалить этот курс? Это действие нельзя будет отменить."
                            // onConfirm={() => courseStore.setShowConfirmDeleteCourseModal(true)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const onFinish = (values: CourseComponentTypeI) => {
        debugger
        if (values.type !== CourseComponentType.Text && (!values.questions || values.questions.length === 0)) {
           message.warning("Вопрос должен быть хотя бы 1!")
           return;
        }
        courseComponentStore.addComponentCourse(values).finally(() => {
            form.resetFields();
            setTypeTask('')
            setIsModalVisible(false)
        });
    }

    const [form] = Form.useForm();


    useEffect(() => {
        courseComponentStore.getAllComponent();
    }, []);

    return (
        <>
            <div className="bg-white h-full p-5">
                <div className="bg-white h-full p-5">
                    <div className="flex items-center justify-between">
                        <h1 className="text-green-800 font-bold text-3xl mb-2">Доступные компоненты</h1>
                        <Button onClick={() => setIsModalVisible(true)} icon={<PlusCircleOutlined/>} type="primary">Добавить компонент</Button>
                    </div>
                    <Divider/>
                    <Table dataSource={courseComponentStore.courseComponents} columns={columns}/>
                </div>
            </div>
            <Modal
                title="Новый компонент"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width={800}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item label="Тип задания" name="type">
                        <Select
                            placeholder="Выберите тип задания"
                            onChange={handleTypeChange}
                        >
                            <Select.Option value={CourseComponentType.Text}>Текст</Select.Option>
                            <Select.Option value={CourseComponentType.Quiz}>Квиз</Select.Option>
                            <Select.Option value={CourseComponentType.Coding}>Программирование</Select.Option>
                            {/*<Select.Option value={CourseComponentType.MultiPlayChoice}>Выбор ответа</Select.Option>*/}
                            {/*<Select.Option value={CourseComponentType.Matching}>Соответствие</Select.Option>*/}
                            {/*<Select.Option value={CourseComponentType.Sequencing}>Последовательность</Select.Option>*/}
                        </Select>
                    </Form.Item>

                    {typeTask === "text" && (
                        <>
                            <Form.Item
                                name="title"
                                label="Заголовок"
                            >
                                <Input placeholder="Введите заголовок"/>
                            </Form.Item>
                            <Form.Item
                                name="tags"
                                label="Теги"
                                rules={[{ required: true, message: 'Пожалуйста, добавьте хотя бы один тег!' }]}
                            >
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    placeholder="Введите тег и нажмите Enter"
                                    tagRender={({ label, closable, onClose }) => (
                                        <Tag closable={closable} onClose={onClose} style={{ margin: 2 }}>
                                            {label}
                                        </Tag>
                                    )}
                                    options={[]}
                                />
                            </Form.Item>
                            <Form.Item
                                name="content_description"
                                label="Содержание"
                            >
                                <ReactQuill theme="snow"/>
                            </Form.Item>
                        </>
                    )}
                    {typeTask === 'quiz' && (
                        <>
                            <Form.Item
                                label="Заголовок компонента"
                                name={['title']}
                            >
                                <Input placeholder="Введите заголовок компонента" />
                            </Form.Item>

                            <Form.Item
                                label="Описание компонента"
                                name={['description']}
                            >
                                <Input.TextArea placeholder="Введите описание компонента" />
                            </Form.Item>

                            <Form.List name={['questions']}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }, qIndex) => (
                                            <div
                                                key={key}
                                                style={{ marginBottom: 16, padding: 10, border: '1px solid #d9d9d9', borderRadius: 4 }}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'question']}
                                                    label={`Вопрос ${qIndex + 1}`}
                                                    rules={[{ required: true, message: 'Введите вопрос' }]}
                                                >
                                                    <Input placeholder="Введите вопрос" />
                                                </Form.Item>

                                                <Form.List name={[name, 'options']}>
                                                    {(optionFields, { add: addOption, remove: removeOption }) => (
                                                        <>
                                                            {optionFields.map((optionField, oIndex) => (
                                                                <Row gutter={8} align="middle" key={optionField.key}>
                                                                    <Col flex="auto">
                                                                        <Form.Item
                                                                            {...optionField}
                                                                            name={[optionField.name]}
                                                                            rules={[{ required: true, message: 'Введите вариант ответа' }]}
                                                                        >
                                                                            <Input placeholder={`Вариант ответа ${oIndex + 1}`} />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col>
                                                                        {optionFields.length > 1 && (
                                                                            <Button
                                                                                type="text"
                                                                                icon={<DeleteOutlined />}
                                                                                onClick={() => removeOption(optionField.name)}
                                                                            />
                                                                        )}
                                                                    </Col>
                                                                </Row>
                                                            ))}
                                                            <Button
                                                                type="dashed"
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
                                                    name={[name, 'correctOption']}
                                                >
                                                    {/*<Select placeholder="Выберите правильный ответ">*/}
                                                    {/*    {form.getFieldValue(['questions', qIndex, 'options'])?.map((option, index) => (*/}
                                                    {/*        <Select.Option key={index} value={index}>*/}
                                                    {/*            {option}*/}
                                                    {/*        </Select.Option>*/}
                                                    {/*    ))}*/}
                                                    {/*</Select>*/}
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
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={() => add()}
                                        >
                                            Добавить вопрос
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </>
                    )}

                    {typeTask === 'coding' && (
                        <>
                            <Form.Item label="Выберите язык программирования" required>
                                <Select
                                    // onChange={handleLanguageChange}
                                >
                                    {languages.map(lang => (
                                        <Select.Option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            {/*<Form.Item label="Код задания">*/}
                            {/*    <CodeMirror*/}
                            {/*        value={newTask.code}*/}
                            {/*        options={{*/}
                            {/*            mode: newTask.languages,*/}
                            {/*            lineNumbers: true,*/}
                            {/*            theme: 'material',*/}
                            {/*        }}*/}
                            {/*        onBeforeChange={(editor, data, value) => {*/}
                            {/*            setNewTask({ ...newTask, code: value });*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</Form.Item>*/}
                        </>
                    )}

                    {/*{newTask.type === 'multiple-choice' && (*/}
                    {/*    <Form.Item label="Варианты ответов">*/}
                    {/*        /!* Implement multiple-choice form elements here *!/*/}
                    {/*        <Input.TextArea*/}
                    {/*            placeholder="Введите варианты ответов"*/}
                    {/*            value={newTask.options.join('\n')}*/}
                    {/*            onChange={(e) => setNewTask({...newTask, options: e.target.value.split('\n')})}*/}
                    {/*        />*/}
                    {/*        <Form.Item label="Правильные ответы">*/}
                    {/*            <Input.TextArea*/}
                    {/*                placeholder="Введите правильные ответы (по одному на строку)"*/}
                    {/*                value={newTask.correctAnswers.join('\n')}*/}
                    {/*                onChange={(e) => setNewTask({...newTask, correctAnswers: e.target.value.split('\n')})}*/}
                    {/*            />*/}
                    {/*        </Form.Item>*/}
                    {/*    </Form.Item>*/}
                    {/*)}*/}

                    {/*{newTask.type === 'matching' && (*/}
                    {/*    <Form.Item label="Соответствия">*/}
                    {/*        /!* Implement matching form elements here *!/*/}
                    {/*        <Input.TextArea*/}
                    {/*            placeholder="Введите пары соответствий"*/}
                    {/*            value={newTask.matching.join('\n')}*/}
                    {/*            onChange={(e) => setNewTask({...newTask, matching: e.target.value.split('\n')})}*/}
                    {/*        />*/}
                    {/*    </Form.Item>*/}
                    {/*)}*/}

                    {/*{newTask.type === 'sequencing' && (*/}
                    {/*    <Form.Item label="Последовательность">*/}
                    {/*        /!* Implement sequencing form elements here *!/*/}
                    {/*        <Input.TextArea*/}
                    {/*            placeholder="Введите элементы последовательности"*/}
                    {/*            value={newTask.sequence.join('\n')}*/}
                    {/*            onChange={(e) => setNewTask({...newTask, sequence: e.target.value.split('\n')})}*/}
                    {/*        />*/}
                    {/*    </Form.Item>*/}
                    {/*)}*/}

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default observer(TaskPage);
