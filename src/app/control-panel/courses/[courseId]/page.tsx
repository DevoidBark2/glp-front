"use client"
import { useParams, useRouter } from "next/navigation";
import {
    Breadcrumb,
    Button,
    Col,
    Divider,
    Form,
    List,
    notification,
    Popconfirm,
    Radio,
    Row,
    Select,
    Spin,
    Switch,
    Tabs,
    Tooltip
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { observer } from "mobx-react";
import { Input } from "antd/lib";
import { LEVEL_COURSE } from "@/shared/constants";
import { PageContainerControlPanel } from "@/shared/ui";
import { StatusCourseEnum, statusLabels } from "@/shared/api/course/model";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { Collapse, Progress } from 'antd';
import { useMobxStores } from "@/shared/store/RootStore";
import { CourseSections } from "@/entities/course/ui";
import { CourseMembers } from "@/entities/course/ui/ControlPanel/CourseMembers";

const { Panel } = Collapse;

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore, nomenclatureStore, examStore, sectionCourseStore } = useMobxStores();
    const [courseName, setCourseName] = useState(null)
    const [form] = Form.useForm();
    const router = useRouter();


    const handleDeleteMember = (id: number) => {
        courseStore.deleteMember(id)
    }

    const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

    const handleSave = () => {
        if (selectedExamId) {
            examStore.setExamForCourse(selectedExamId, Number(courseId)).then(response => {
                notification.success({ message: response.message })
            })
        }
    };

    useEffect(() => {
        nomenclatureStore.getCategories();
        courseStore.getCourseDetailsById(Number(courseId)).then(response => {
            form.setFieldsValue(response);
            form.setFieldValue("category", response.category?.id);
            setCourseName(response.name)

            courseStore.getCourseDetailsSections(Number(courseId));
            courseStore.getAllMembersCourse(Number(courseId));
            examStore.getUserExams();
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
            defaultActiveKey="1"
            items={
                [
                    {
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
                        label: 'Разделы и компоненты', key: '2', children: <CourseSections />,
                    }, {
                        label: 'Участники курса',
                        key: '3',
                        children: <CourseMembers />
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