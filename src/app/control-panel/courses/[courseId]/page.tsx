"use client"
import {useParams, useRouter} from "next/navigation";
import {
    Breadcrumb,
    Button,
    Col,
    Divider, Empty,
    Form, List, message, Modal,
    notification,
    Popconfirm,
    Row,
    Select,
    Spin,
    Table,
    TableColumnsType,
    Tabs, Tag, Tooltip
} from "antd";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Input} from "antd/lib";
import {FORMAT_VIEW_DATE, LEVEL_COURSE} from "@/constants";
import {PlusCircleOutlined,
    DeleteOutlined,
    EditOutlined,} from "@ant-design/icons";
import dayjs from "dayjs";
import {PageContainerControlPanel} from "@/shared/ui";
import { StatusComponentTaskEnum } from "@/shared/api/component-task";
import {CourseComponentTypeI} from "@/shared/api/course/model";

const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const CoursePage = () => {
    const {courseId} = useParams();
    const {courseStore,nomenclatureStore,sectionCourseStore} = useMobxStores();
    const [courseName,setCourseName] = useState(null)
    const [form] = Form.useForm();
    const router = useRouter();

    const [isCourseLocked, setIsCourseLocked] = useState(false);
    const [participants, setParticipants] = useState(['John Doe', 'Jane Smith']);

    const handleLockToggle = (checked:boolean) => {
        setIsCourseLocked(checked);
        message.success(`Курс ${checked ? 'заблокирован' : 'разблокирован'}`);
    };

    const handleDeleteParticipants = () => {
        Modal.confirm({
            title: 'Удалить всех участников?',
            content: 'Вы уверены, что хотите удалить всех участников курса? Это действие необратимо.',
            onOk() {
                setParticipants([]);
                message.success('Все участники курса были удалены');
            },
            onCancel() {
                message.info('Удаление участников отменено');
            },
        });
    };

    const handleChangeSection = (id: number) => {
        router.push(`/control-panel/sections/${id}`)
    }

    const handleDeleteSection = (id: number) => {
        sectionCourseStore.deleteSection(id).then(response => {
            courseStore.courseDetailsSections.filter(it => it.id !== id);
            notification.success({message: response.message});
        });
    }

    const columns: TableColumnsType<CourseComponentTypeI> = [
        {
            title: 'Название раздела',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (value) => {
                return value.length > 30 ? `${value.slice(0, 30)}...` : value
            }
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (description) => {
                if (!description || description.trim().length === 0) {
                    return <span className="text-gray-400">Нет описания</span>;
                }
            
                return description.length > 30 
                    ? `${description.slice(0, 30)}...` 
                    : description;
            }
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '30%',
            render: (date) => (
                <Tooltip title="Время создания">
                    {dayjs(date).format(FORMAT_VIEW_DATE)}
                </Tooltip>
            ),
        },
        {
            title: "Действия",
            align: 'start',
            render: (_, record) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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
                </div>
            )
        },
    ];

    const handleDeleteComponent = (id: number) => {
        console.log("Удаление компонента с ID:", id);
    };

    useEffect(() => {
        nomenclatureStore.getCategories();
        courseStore.getCourseDetails(Number(courseId)).then(response => {
            form.setFieldsValue(response.data);
            form.setFieldValue("category",response.data.category?.id);
            setCourseName(response.data.name)
        }).catch(e => {
            router.push('/control-panel/courses')
            notification.warning({message: e.response.data.result})
        }).finally(() => {
            courseStore.setLoadingCourseDetails(false)
        })
    }, [courseId]);

    return (
        <PageContainerControlPanel>
            <div className="flex items-center justify-between">
                <Breadcrumb items={[ {
                    title: <Link href={"/control-panel/courses"}>Доступные курсы</Link>,
                },{
                    title: <p>{courseName}</p>,
                }]}/>
            </div>
            <h1 className="text-center text-3xl">Редактирование курса</h1>
            <Divider/>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: 'Основное',
                        key: '1',
                        children: <Form
                        form={form}
                        layout="vertical"
                        style={{ overflowX: 'hidden' }} // Скрытие горизонтального скролла
                        onFinish={(values) =>
                            courseStore.changeCourse(values).then(() => {
                                setCourseName(values.name);
                            })
                        }
                    >
                        {!courseStore.loadingCourseDetails ? (
                            <>
                                <Row gutter={24} style={{ padding: '0 16px' }}>
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
                                            <Input placeholder="Введите краткое описание курса" style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                    
                                <Row gutter={24} style={{ padding: '0 16px' }}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="category"
                                            label="Категория"
                                            rules={[
                                                {
                                                    required: nomenclatureStore.categories.length > 0,
                                                    message: 'Категория курса обязательно!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                loading={nomenclatureStore.loadingCategories}
                                                placeholder="Выберите категорию"
                                                style={{ width: '100%' }}
                                            >
                                                {!nomenclatureStore.loadingCategories && nomenclatureStore.categories.length > 0 ? nomenclatureStore.categories.map((category) => (
                                                    <Select.Option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </Select.Option>
                                                )) : <Spin/>}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="access_right"
                                            label="Права доступа"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Права доступа курса обязательно!',
                                                },
                                            ]}
                                        >
                                            <Select style={{ width: '100%' }}>
                                                <Select.Option value={0}>Открытый</Select.Option>
                                                <Select.Option value={1}>Закрытый</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                    
                                <Form.Item
                                    name="duration"
                                    label="Время прохождения"
                                    rules={[{ required: true, message: 'Время прохождения курса обязательно!' }]}
                                >
                                    <Input
                                        placeholder="Введите время прохождения"
                                        type="number"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                    
                                <Form.Item
                                    name="level"
                                    label="Уровень сложности"
                                    rules={[{ required: true, message: 'Уровень сложности курса обязательно!' }]}
                                >
                                    <Select style={{ width: '100%' }}>
                                        {LEVEL_COURSE.map((level) => (
                                            <Select.Option key={level.id} value={level.id}>
                                                {level.title}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                    
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
                            </>
                        ) : (
                            <Spin />
                        )}
                    </Form>
                    
                    },
                    {
                        label: 'Разделы и компоненты',
                        key: '2',
                        children: <div className="p-2">
                            {courseStore.courseDetailsSections.length > 0 ? (
                                    <Table
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
                                                    {record.sectionComponents.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {record.sectionComponents.map((component:any) => (
                                                            <div 
                                                                key={component.id} 
                                                                className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow relative"
                                                            >
                                                                <Button
                                                                    icon={<DeleteOutlined/>}
                                                                    type="primary"
                                                                    danger
                                                                    onClick={() => handleDeleteComponent(component.id)}
                                                                    className="absolute top-2 right-2"
                                                                />
                                                                <h4 className="font-medium text-xl text-gray-800 mb-2">
                                                                    {component.title || "Нет заголовка"}
                                                                </h4>
                                                                <p className="text-gray-600 mb-3">
                                                                    {component.description || 'Нет описания'}
                                                                </p>
                                                                <div className="text-sm text-gray-500">
                                                                    <span className="block mb-1">Тип: 
                                                                        {/*<Tag icon={typeIcons[component.type]}>*/}
                                                                        {/*    <span style={{ marginLeft: 8 }}>{component.type}</span>*/}
                                                                        {/*</Tag>*/}
                                                                    </span>
                                                                    <span className="block mb-1">Статус: 
                                                                        <Tag color={component.status === StatusComponentTaskEnum.ACTIVATED ? 'green' : 'red'}>
                                                                            {component.status === StatusComponentTaskEnum.ACTIVATED ? 'Активен' : 'Неактивен'}
                                                                        </Tag>
                                                                    </span>
                                                                    <span>Создано: {dayjs(component.created_at).format(FORMAT_VIEW_DATE)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    ) : (
                                                        <span className="text-gray-500">Нет компонентов</span>
                                                    )}
                                                </div>
                                            </div>
                                            }
                                        }}
                                    />
                                ) : (
                                    <Empty
                                        description={
                                            <div>
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
                                            </div>
                                        }
                                    />
                                )}
                        </div>,
                    },
                    {
                        label: 'Дополнительные настройки',
                        key: '3',
                        children: (
                            <div style={{ padding: '10px 0', borderBottom: '1px solid #ddd', marginBottom: 10 }}>
                                    <h3 style={{ marginBottom: 10 }}>👥 Текущие участники</h3>
                                    {participants.length > 0 ? (
                                        <List
                                            bordered
                                            dataSource={participants}
                                            renderItem={(item, index) => (
                                                <List.Item>
                                                    {index + 1}. {item}
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <p style={{ fontStyle: 'italic', color: 'gray' }}>
                                            Нет участников. Начните приглашать новых!
                                        </p>
                                    )}
                            </div>
                        )
                    },
                ]}
            />
        </PageContainerControlPanel>
    )
}
export default observer(CoursePage);