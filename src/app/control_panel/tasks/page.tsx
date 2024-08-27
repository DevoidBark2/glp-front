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
    TableColumnsType,
    Tag,
    Tooltip
} from "antd";
import {
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
} from "@ant-design/icons";
import {CourseComponentType} from "@/enums/CourseComponentType";
import {FILTER_STATUS_COMPONENT_COURSE, FILTER_TYPE_COMPONENT_COURSE, FORMAT_VIEW_DATE} from "@/constants";
import {useMobxStores} from "@/stores/stores";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {observer} from "mobx-react";
import {CourseComponentTypeI} from "@/stores/CourseComponent";
import {StatusComponentTaskEnum} from "@/enums/StatusComponentTaskEnum";
import dayjs from "dayjs";
import {exec} from "node:child_process";

const TaskPage = () => {
    const {courseComponentStore} = useMobxStores()

    const [typeTask,setTypeTask] = useState<CourseComponentType | null>(null)
    const [changedComponent,setChangedComponent] = useState<number | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewContent, setPreviewContent] = useState<CourseComponentTypeI | null>(null);

    const handlePreview = (record: CourseComponentTypeI) => {
        setPreviewContent(record);
        setPreviewVisible(true);
    };

    const handleTypeChange = (value: CourseComponentType) => {
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
                    <p
                        className="hover:cursor-pointer"
                        onClick={() => handleChangeComponentTask(record)}
                        style={{ color: text ? 'blue' : 'grey' }}
                    >
                        {text ?? 'Название не указано'}
                    </p>
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
            title: "Дата создания",
            dataIndex: "created_at",
            sorter: (a, b) => {
                return dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf();
            },
            render: (_,record) => dayjs(record.created_at).format(FORMAT_VIEW_DATE)
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: FILTER_STATUS_COMPONENT_COURSE,
            onFilter: (value, record) => record.status.startsWith(value as string),
            render: (status) => (
                <Tag color={status === StatusComponentTaskEnum.ACTIVATED ? 'green' : 'red'}>
                    {status === StatusComponentTaskEnum.ACTIVATED ? 'Активен' : 'Неактивен'}
                </Tag>
            ),
        },
        {
            title: "Действия",
            align: 'start',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Tooltip title="Предварительный просмотр">
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Редактировать компонент">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            className="mr-2"
                            onClick={() => handleChangeComponentTask(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Удалить компонент?"
                        description="Вы уверены, что хотите удалить этот компонент? Это действие нельзя будет отменить."
                        okText="Да"
                        onConfirm={() => courseComponentStore.deleteComponent(record.id)}
                        cancelText="Нет"
                    >
                        <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </div>
            )
        },
    ];

    const handleChangeComponentTask = (record: CourseComponentTypeI) => {
        setChangedComponent(record.id)
        setTypeTask(record.type);
        form.setFieldsValue(record);
        setIsModalVisible(true)
    }

    const onFinish = (values: CourseComponentTypeI) => {
        if (values.type !== CourseComponentType.Text && (!values.questions || values.questions.length === 0)) {
           message.warning("Вопрос должен быть хотя бы 1!")
           return;
        }

        changedComponent ? courseComponentStore.changeComponent(values).finally(() => {
                setIsModalVisible(false)
            }) :
        courseComponentStore.addComponentCourse(values).finally(() => {
            form.resetFields();
            setTypeTask(null)
            setIsModalVisible(false)
        });
    }

    const [form] = Form.useForm();


    useEffect(() => {
        courseComponentStore.getAllComponent().finally(() => {
            courseComponentStore.setLoadingCourseComponent(false)
        });
    }, []);

    return (
        <>
            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                <div className="bg-white h-full p-5">
                    <div className="flex items-center justify-between">
                        <h1 className="text-green-800 font-bold text-3xl mb-2">Доступные компоненты</h1>
                        <Button onClick={() => setIsModalVisible(true)} icon={<PlusCircleOutlined/>} type="primary">Добавить компонент</Button>
                    </div>
                    <Divider/>
                    <Table
                        rowKey={(record) => record.id}
                        dataSource={courseComponentStore.courseComponents}
                        columns={columns}
                        loading={courseComponentStore.loadingCourseComponent}
                    />
                </div>
            </div>

            <Modal
                title="Новый компонент"
                open={isModalVisible}
                onCancel={() => {
                    form.resetFields();
                    setChangedComponent(null)
                    setTypeTask(null);
                    setIsModalVisible(false)
                }}
                width={800}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item name="id" hidden></Form.Item>
                    <Form.Item
                        label="Тип задания"
                        name="type"
                        rules={[{required: true, message: "Выберите тип задания!"}]}
                    >
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

                    {
                        changedComponent && <Form.Item
                            label="Статус"
                            name="status"
                        >
                            <Select
                                placeholder="Выберите статус"
                                style={{ width: '100%' }}
                            >
                                <Select.Option value={StatusComponentTaskEnum.ACTIVATED}>
                                    <Tag color="green">Активен</Tag>
                                </Select.Option>
                                <Select.Option value={StatusComponentTaskEnum.DEACTIVATED}>
                                    <Tag color="red">Неактивен</Tag>
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    }

                    {typeTask === CourseComponentType.Text && (
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
                    {typeTask === CourseComponentType.Quiz && (
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
                                                                <Row gutter={8} align="stretch" key={optionField.key}>
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
                                                                        <Button
                                                                            type="text"
                                                                            icon={<DeleteOutlined />}
                                                                            onClick={() => removeOption(optionField.name)}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            ))}
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
                                            className="mb-4"
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

                    {typeTask === CourseComponentType.Coding && (
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
                        <Button type="primary" htmlType="submit">{changedComponent ? "Изменить" : "Добавить"}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default observer(TaskPage);
