"use client"
import { useParams, useRouter } from "next/navigation";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Form,
    List,
    message,
    notification,
    Popconfirm,
    Radio,
    Row,
    Select,
    Spin,
    Switch,
    Table,
    TableColumnsType,
    Tabs,
    Tag,
    Tooltip
} from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { observer } from "mobx-react";
import { Input } from "antd/lib";
import { FORMAT_VIEW_DATE, LEVEL_COURSE } from "@/shared/constants";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, } from "@ant-design/icons";
import dayjs from "dayjs";
import { PageContainerControlPanel } from "@/shared/ui";
import { StatusComponentTaskEnum } from "@/shared/api/component-task";
import { CourseComponentTypeI, StatusCourseEnum, statusLabels } from "@/shared/api/course/model";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { typeIcons } from "@/columnsTables/taskColumns";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Collapse, Progress } from 'antd';
import { useMobxStores } from "@/shared/store/RootStore";

const { Panel } = Collapse;

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore, nomenclatureStore, examStore, sectionCourseStore } = useMobxStores();
    const [courseName, setCourseName] = useState(null)
    const [form] = Form.useForm();
    const router = useRouter();

    const [isCourseLocked, setIsCourseLocked] = useState(false);

    const handleLockToggle = (checked: boolean) => {
        setIsCourseLocked(checked);
        message.success(`Курс ${checked ? 'заблокирован' : 'разблокирован'}`);
    };


    const handleChangeSection = (id: number) => {
        router.push(`/control-panel/sections/${id}`)
    }

    const handleDeleteSection = (id: number) => {
        sectionCourseStore.deleteSection(id).then(response => {
            courseStore.courseDetailsSections.filter(it => it.id !== id);
            notification.success({ message: response.message });
        });
    }

    const handleDeleteMember = (id: number) => {
        courseStore.deleteMember(id)
    }

    const columns: TableColumnsType<CourseComponentTypeI> = [{
        title: 'Название раздела', dataIndex: 'name', key: 'name', width: '30%', render: (value) => {
            return value.length > 30 ? `${value.slice(0, 30)}...` : value
        }
    }, {
        title: 'Описание', dataIndex: 'description', key: 'description', width: '40%', render: (description) => {
            if (!description || description.trim().length === 0) {
                return <span className="text-gray-400">Нет описания</span>;
            }

            return description.length > 30 ? `${description.slice(0, 30)}...` : description;
        }
    }, {
        title: 'Дата создания',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '30%',
        render: (date) => (<Tooltip title="Время создания">
            {dayjs(date).format(FORMAT_VIEW_DATE)}
        </Tooltip>),
    }, {
        title: "Действия",
        align: 'start',
        render: (_, record) => (<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Tooltip title="Редактировать раздел">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => handleChangeSection(record.id)}
                />
            </Tooltip>
            <Popconfirm
                title="Удалить компонент?"
                description="Вы уверены, что хотите удалить этот компонент? Это действие нельзя будет отменить."
                okText="Да"
                onConfirm={() => handleDeleteSection(record.id)}
                cancelText="Нет"
            >
                <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                />
            </Popconfirm>
        </div>)
    },];

    const handleDeleteComponent = (id: number) => {
        console.log("Удаление компонента с ID:", id);
    };

    const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

    const handleSave = () => {
        if (selectedExamId) {
            examStore.setExamForCourse(selectedExamId, Number(courseId)).then(response => {
                notification.success({ message: response.message })
            })
        }
    };

    const handleChangeStep = (step: string) => {
        if (Number(step) === 2) {
            courseStore.getCourseDetailsSections(Number(courseId));
        } else if (Number(step) === 3) {
            courseStore.getAllMembersCourse(Number(courseId));
        } else if (Number(step) === 4) {
            examStore.getUserExams();
        }
    }

    useEffect(() => {
        nomenclatureStore.getCategories();
        courseStore.getCourseDetailsById(Number(courseId)).then(response => {
            form.setFieldsValue(response);
            form.setFieldValue("category", response.category?.id);
            setCourseName(response.name)
        }).catch(e => {
            router.push('/control-panel/courses')
            notification.warning({ message: e.response.data.result })
        }).finally(() => {
            courseStore.setLoadingCourseDetails(false)
        })
    }, [courseId]);

    return (<PageContainerControlPanel>
        <div className="flex items-center justify-between">
            <Breadcrumb items={[{
                title: <Link href={"/control-panel/courses"}>Доступные курсы</Link>,
            }, {
                title: <p>{courseName}</p>,
            }]} />
        </div>
        <h1 className="text-center text-3xl">Редактирование курса</h1>
        <Divider />
        <Tabs
            onChange={handleChangeStep}
            defaultActiveKey="1"
            items={[{
                label: 'Основное', key: '1', children: <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => courseStore.changeCourse(values).then(() => {
                        setCourseName(values.name);
                    })}
                >
                    {!courseStore.loadingCourseDetails ? (<>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="id" hidden />
                                <Form.Item
                                    name="name"
                                    label="Название курса"
                                    rules={[{ required: true, message: 'Название курса обязательно!' }]}
                                >
                                    <Input placeholder="Введите название курса" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="small_description"
                                    label="Краткое описание"
                                >
                                    <Input placeholder="Введите краткое описание курса"
                                        style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="category"
                                    label="Категория"
                                    rules={[{
                                        required: nomenclatureStore.categories.length > 0,
                                        message: 'Категория курса обязательно!',
                                    },]}
                                >
                                    <Select
                                        loading={nomenclatureStore.loadingCategories}
                                        placeholder="Выберите категорию"
                                        style={{ width: '100%' }}
                                    >
                                        {!nomenclatureStore.loadingCategories && nomenclatureStore.categories.length > 0 ? nomenclatureStore.categories.map((category) => (
                                            <Select.Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Select.Option>)) : <Spin />}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="access_right"
                                    label="Права доступа"
                                    rules={[{
                                        required: true, message: 'Права доступа курса обязательно!',
                                    },]}
                                >
                                    <Select style={{ width: '100%' }}>
                                        <Select.Option value={0}>Открытый</Select.Option>
                                        <Select.Option value={1}>Закрытый</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="duration"
                                    label="Время прохождения"
                                    rules={[{
                                        required: true, message: "Время прохождения курса обязательно!"
                                    }]}
                                >
                                    <Input placeholder="Введите время прохождения" type="number" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="level"
                                    label="Уровень сложности"
                                    rules={[{
                                        required: true, message: "Уровень сложности курса обязательно!"
                                    }]}
                                >
                                    <Select>
                                        {LEVEL_COURSE.map(level => (<Select.Option key={level.id}
                                            value={level.id}>{level.title}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="has_certificate"
                                    label="Курс с сертификатом"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Да"
                                        unCheckedChildren="Нет"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Статус курса"
                                    rules={[{
                                        required: true, message: "Пожалуйста, выберите статус курса!"
                                    }]}
                                >
                                    <Select>
                                        {Object.entries(StatusCourseEnum).map(([key, value]) => (
                                            <Select.Option key={value} value={value}>
                                                {statusLabels[value as StatusCourseEnum]} {/* Отображаем читаемое название */}
                                            </Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="content_description" label="Содержание курса">
                            {typeof window !== 'undefined' && <ReactQuill theme="snow" />}
                        </Form.Item>

                        <div className="flex flex-col items-center">
                            <Form.Item style={{ marginTop: '10px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={courseStore.loadingCreateCourse}
                                >
                                    Редактировать
                                </Button>
                            </Form.Item>
                        </div>
                    </>) : (<Spin />)}
                </Form>

            }, {
                label: 'Разделы и компоненты', key: '2', children: <div className="p-2">
                    {courseStore.courseDetailsSections.length > 0 ? (<Table
                        dataSource={courseStore.courseDetailsSections}
                        columns={columns as any}
                        bordered
                        rowKey={record => record.id}
                        pagination={{ pageSize: 20 }}
                        expandable={{
                            expandedRowRender: (record) => {
                                return <div className="bg-gray-100 rounded p-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold">Компоненты</h3>
                                        <Divider />
                                        {record.sectionComponents.length > 0 ? (<div
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <DragDropContext onDragEnd={() => {
                                            }}>
                                                <Droppable droppableId="droppable-list">
                                                    {(provided) => (<div {...provided.droppableProps}
                                                        ref={provided.innerRef}>
                                                        {record.sectionComponents.map((component, index) => (
                                                            <Draggable key={component.id}
                                                                draggableId={String(component.id)}
                                                                index={index}>
                                                                {(provided) => (<div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow mb-2"
                                                                >
                                                                    <div
                                                                        className="flex items-center justify-between">
                                                                        <h4 className="font-medium text-xl text-gray-800 mb-2">
                                                                            {component.componentTask.title || "Нет заголовка"}
                                                                        </h4>
                                                                        <Button
                                                                            icon={<DeleteOutlined />}
                                                                            type="primary"
                                                                            danger
                                                                            onClick={() => handleDeleteComponent(component.id)}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="text-sm text-gray-500">
                                                                        <span
                                                                            className="block mb-1">
                                                                            Тип:
                                                                            <Tag
                                                                                className="ml-2"
                                                                                icon={typeIcons[component.componentTask.type]}>
                                                                                <span>{component.componentTask.type}</span>
                                                                            </Tag>
                                                                        </span>
                                                                        <span
                                                                            className="block mb-1">
                                                                            Статус:
                                                                            <Tag
                                                                                color={component.status === StatusComponentTaskEnum.ACTIVATED ? "green" : "red"}
                                                                            >
                                                                                {component.status === StatusComponentTaskEnum.ACTIVATED ? "Активен" : "Неактивен"}
                                                                            </Tag>
                                                                        </span>
                                                                        <span>
                                                                            Создано: {dayjs(component.componentTask.created_at).format(FORMAT_VIEW_DATE)}
                                                                        </span>
                                                                    </div>
                                                                </div>)}
                                                            </Draggable>))}
                                                        {provided.placeholder}
                                                    </div>)}
                                                </Droppable>
                                            </DragDropContext>
                                        </div>) : (<span className="text-gray-500">Нет компонентов</span>)}
                                    </div>
                                </div>
                            }
                        }}
                    />) : (<Empty
                        description={<div>
                            <p>Список пуст</p>
                            <Link href="/control-panel/sections/add">
                                <Button
                                    className="mt-2 transition-transform transform hover:scale-105"
                                    type="primary"
                                    icon={<PlusCircleOutlined />}
                                >
                                    Создать раздел
                                </Button>
                            </Link>
                        </div>}
                    />)}
                </div>,
            }, {
                label: 'Участники курса',
                key: '3',
                children: (
                    <div style={{ padding: '20px 0', borderBottom: '1px solid #ddd', marginBottom: 10 }}>
                        <h3 style={{ marginBottom: 15, fontWeight: 'bold', fontSize: '18px' }}>👥 Текущие участники</h3>
                        {courseStore.courseMembers.length > 0 ? (
                            <Collapse accordion>
                                {courseStore.courseMembers.map((item, index) => (
                                    <Panel
                                        header={
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">
                                                    {item.user.first_name} {item.user.second_name || ''}
                                                </h4>
                                            </div>
                                        }
                                        key={item.id}
                                    >
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Запись на курс: {new Date(item.enrolledAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <Tooltip title="Удалить участника">
                                                    <Popconfirm
                                                        title="Удалить участиника?"
                                                        placement="leftBottom"
                                                        description="Вы уверены, что хотите удалить данного учестаника? Это действие нельзя будет отменить."
                                                        okText="Да"
                                                        onConfirm={() => handleDeleteMember(item.id)}
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

                                            <p className="text-gray-600">
                                                <strong>Прогресс:</strong>
                                            </p>
                                            <Progress percent={item.progress} status="active" />
                                        </div>
                                    </Panel>
                                ))}
                            </Collapse>
                        ) : (
                            <p className="italic text-gray-500">Нет участников вашего курса!</p>
                        )}
                    </div>
                ),
            },
            {
                label: 'Дополнительные параметры',
                key: '4',
                children: (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            Выбор экзамена
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Выберите экзамен, который будет активным для курса. Нажмите "Сохранить",
                            чтобы подтвердить выбор.
                        </p>

                        <List
                            bordered
                            dataSource={examStore.exams}
                            renderItem={(exam) => (
                                <List.Item
                                    className={`cursor-pointer transition-all ${selectedExamId === exam.id
                                        ? "bg-blue-100 border-l-4 border-blue-500"
                                        : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => setSelectedExamId(exam.id)}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <h3 className={`font-bold ${selectedExamId === exam.id ? "text-blue-800" : "text-gray-800"}`}>
                                                {exam.title}
                                            </h3>
                                            <p className="text-gray-500">
                                                Статус:{" "}
                                                <span
                                                    className={exam.status === "active" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}
                                                >
                                                    {exam.status === "active" ? "Активный" : "Деактивирован"}
                                                </span>
                                            </p>
                                            <p className="text-gray-500">Создано: {new Date(exam.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Radio checked={selectedExamId === exam.id} />
                                    </div>
                                </List.Item>
                            )}
                        />

                        <Button
                            type="primary"
                            onClick={handleSave}
                            className="w-full md:w-auto mt-4"
                            disabled={!selectedExamId}
                        >
                            Сохранить выбор
                        </Button>
                    </div>
                ),
            }
            ]}
        />
    </PageContainerControlPanel>)
}
export default observer(CoursePage);