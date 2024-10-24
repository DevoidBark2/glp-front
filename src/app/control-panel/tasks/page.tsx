"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Col,
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
    PlusOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
} from "@ant-design/icons";
import { CourseComponentType } from "@/enums/CourseComponentType";
import { FILTER_STATUS_COMPONENT_COURSE, FILTER_TYPE_COMPONENT_COURSE, FORMAT_VIEW_DATE } from "@/constants";
import { useMobxStores } from "@/stores/stores";
import 'react-quill/dist/quill.snow.css';
import { observer } from "mobx-react";
import { CourseComponentTypeI } from "@/stores/CourseComponent";
import { StatusComponentTaskEnum } from "@/enums/StatusComponentTaskEnum";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import PageHeader from "@/components/PageHeader/PageHeader";
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)

interface WarningModalType {
    data: CourseComponentTypeI;
    message: string;
}
const TaskPage = () => {
    const { courseComponentStore } = useMobxStores()
    const [form] = Form.useForm();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [changedComponent, setChangedComponent] = useState<number | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [warningModal, setWarningModal] = useState<WarningModalType | null>(null);
    const [options, setOptions] = useState<Record<number, string[]>>({});

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
            width: "20%",
            render: (text, record) => (
                <Tooltip title={text ? `Перейти к редактированию: ${text}` : 'Название не указано'}>
                    <p
                        className="cursor-pointer"
                        onClick={() => handleChangeComponentTask(record)}
                        style={{ color: !text ? 'grey' : "black" }}
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {typeIcons[record.type]}
                    <span style={{ marginLeft: 8 }}>{value}</span>
                </div>
            ),
        },
        {
            title: "Дата создания",
            dataIndex: "created_at",
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (_, record) => dayjs(record.created_at).format(FORMAT_VIEW_DATE)
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
                    <Tooltip title="Редактировать компонент">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
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

    const handleValuesChange = (_, allValues) => {
        const updatedOptions = allValues.questions?.reduce((acc, question, index) => {
            acc[index] = question?.options || [];
            return acc;
        }, {});

        setOptions(updatedOptions || {});
    };

    const handleChangeComponentTask = (record: CourseComponentTypeI) => {
        setChangedComponent(record.id)
        setTypeTask(record.type);
        form.setFieldsValue(record);
        const extractedOptions = record.questions?.reduce((acc, question, index) => {
            acc[index] = question?.options || [];
            return acc;
        }, {});

        // Устанавливаем options в state
        setOptions(extractedOptions || {})
        setIsModalVisible(true)
    }

    const onFinish = (values: CourseComponentTypeI) => {
        if (values.type !== CourseComponentType.Text && (!values.questions || values.questions.length === 0)) {
            message.warning("Вопрос должен быть хотя бы 1!")
            return;
        }

        if (values.type === CourseComponentType.Text && !values.content_description) {
            setWarningModal({
                data: values,
                message: "Для текстового типа контент должен содержать описание!"
            });
            return;
        }
        debugger
        changedComponent ? courseComponentStore.changeComponent(values).finally(() => {
            setIsModalVisible(false)
        }) :
            courseComponentStore.addComponentCourse(values).finally(() => {
                form.resetFields();
                setTypeTask(null)
                setIsModalVisible(false)
            });
    }

    useEffect(() => {
        courseComponentStore.getAllComponent();
    }, []);

    return (
        <>
            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen">
                <PageHeader
                    title="Доступные компоненты"
                    buttonTitle="Добавить компонент"
                    onClickButton={() => setIsModalVisible(true)}
                    showBottomDivider
                />
                <Table
                    rowKey={(record) => record.id}
                    dataSource={courseComponentStore.courseComponents}
                    rowSelection={{ type: "checkbox" }}
                    columns={columns}
                    loading={courseComponentStore.loadingCourseComponent}
                />
            </div>

            <Modal
                open={!!warningModal}
                onCancel={() => setWarningModal(null)}
                onOk={() => {
                    courseComponentStore.addComponentCourse(warningModal!.data).finally(() => {
                        setWarningModal(null)
                        form.resetFields();
                        setTypeTask(null)
                        setIsModalVisible(false)
                    });
                }}
                centered
            >
                <div className="text-center">
                    <h2 className="text-lg font-bold mb-2">Предупреждение</h2>
                    <p>{warningModal?.message}</p>
                </div>
            </Modal>

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
                    onValuesChange={handleValuesChange}
                >
                    <Form.Item name="id" hidden></Form.Item>
                    <Form.Item
                        label="Тип задания"
                        name="type"
                        rules={[{ required: true, message: "Выберите тип задания!" }]}
                    >
                        <Select
                            placeholder="Выберите тип задания"
                            onChange={(value: CourseComponentType) => setTypeTask(value)}
                        >
                            <Select.Option value={CourseComponentType.Text}>Текст</Select.Option>
                            <Select.Option value={CourseComponentType.Quiz}>Квиз</Select.Option>
                            {/* <Select.Option value={CourseComponentType.Coding}>Программирование</Select.Option> */}
                            <Select.Option value={CourseComponentType.MultiPlayChoice}>Множестенный выбор</Select.Option>
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
                                <Input placeholder="Введите заголовок" />
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
                                <ReactQuill theme="snow" />
                            </Form.Item>
                        </>
                    )}
                    {typeTask === CourseComponentType.Quiz && (
                        <>
                            <Form.Item
                                label="Заголовок"
                                name="title"
                            >
                                <Input placeholder="Введите заголовок" />
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
                                label="Описание компонента"
                                name="description"
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

                                                <Form.Item label="Правильный ответ" name={[name, 'correctOption']}>
                                                    <Select placeholder="Выберите правильный ответ">
                                                        {options[qIndex]?.map((option: string, index: number) => (
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
                                            onClick={() => add()}
                                        >
                                            Добавить вопрос
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </>
                    )}

                    {typeTask === CourseComponentType.MultiPlayChoice && (
                        <div className="multi-choice-container">

                            <Form.Item
                                label="Заголовок"
                                name="title"
                            >
                                <Input placeholder="Введите заголовок" />
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
                                label="Описание компонента"
                                name="description"
                            >
                                <Input.TextArea placeholder="Введите описание компонента" />
                            </Form.Item>

                            <h3>Вопрос с множественным выбором</h3>

                            <Form.List name={['questions']}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }, qIndex) => (
                                            <div
                                                key={key}
                                                style={{ marginBottom: 16, padding: 10, border: '1px solid #d9d9d9', borderRadius: 4 }}
                                            >
                                                {/* Вопрос */}
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'question']}
                                                    label={`Вопрос ${qIndex + 1}`}
                                                    rules={[{ required: true, message: 'Введите вопрос' }]}
                                                >
                                                    <Input placeholder="Введите вопрос" />
                                                </Form.Item>

                                                {/* Варианты ответов */}
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
                                                                            <Input placeholder={`Вариант ${oIndex + 1}`} />
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

                                               {/* Выбор правильного ответа */}
                                                <Form.Item
                                                    label="Правильный ответ(ы)"
                                                    name={[name, 'correctOptions']}
                                                    rules={[{ required: true, message: 'Пожалуйста, выберите правильный ответ(ы)' }]}
                                                >
                                                    <Checkbox.Group>
                                                        <div className="flex flex-col">
                                                            {form.getFieldValue(['questions', qIndex, 'options'])?.map((option, index) => (
                                                                <Checkbox key={index} value={index}>
                                                                    <div className="option-box">
                                                                        <span className="option-text">{option}</span>
                                                                    </div>
                                                                </Checkbox>
                                                            ))}
                                                        </div>
                                                    </Checkbox.Group>
                                                </Form.Item>


                                                {/* Удаление вопроса */}
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
                                        {/* Кнопка для добавления нового вопроса */}
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
                        </div>
                    )}


                    <Form.Item>
                        <Button type="primary" htmlType="submit">{changedComponent ? "Изменить" : "Добавить"}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default observer(TaskPage);
