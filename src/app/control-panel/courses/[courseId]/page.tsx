"use client"
import {useParams, useRouter} from "next/navigation";
import {
    Breadcrumb,
    Button,
    Col,
    Collapse,
    Divider, Empty,
    Form, List, message, Modal,
    notification,
    Row,
    Select,
    Spin, Switch,
    Tabs, Tooltip
} from "antd";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {Input} from "antd/lib";
import {FORMAT_VIEW_DATE, LEVEL_COURSE} from "@/constants";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {PlusCircleOutlined, SettingOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const CoursePage = () => {
    const {courseId} = useParams();
    const {courseStore,nomenclatureStore} = useMobxStores();
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
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
            <div className="bg-white h-full p-5">
                <div className="flex items-center justify-between">
                    <Breadcrumb items={[ {
                        title: <Link href={"/control-panel/courses"}>Доступные курсы</Link>,
                    },{
                        title: <p>{courseStore.loadingCourseDetails ? <Spin/> : courseName}</p>,
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
                                onFinish={(values) => courseStore.changeCourse(values).then(() => {
                                    setCourseName(values.name)
                                })}
                            >
                                {
                                    !courseStore.loadingCourseDetails ? <>
                                        <Row gutter={80}>
                                            <Col span={12}>
                                                <Form.Item name="id" hidden></Form.Item>
                                                <Form.Item
                                                    name="name"
                                                    label="Название курса"
                                                    rules={[{required: true,message:"Название курса обязательно!"}]}
                                                >
                                                    <Input placeholder="Введите название курса"/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="small_description"
                                                    label="Краткое описание"
                                                >
                                                    <Input placeholder="Введите краткое описание курса"/>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row gutter={80}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="category"
                                                    label="Категория"
                                                    rules={[{ required: nomenclatureStore.categories.length > 0, message: "Категория курса обязательно!" }]}
                                                >
                                                    <Select loading={nomenclatureStore.loadingCategories} placeholder="Выберите категорию">
                                                        {
                                                            nomenclatureStore.categories.map(category => (
                                                                <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item
                                                    name="access_right"
                                                    label="Права доступа"
                                                    rules={[{required: true,message:"Права доступа курса обязательно!"}]}
                                                >
                                                    <Select>
                                                        <Select.Option value={0}>Открытый</Select.Option>
                                                        <Select.Option value={1}>Закрытый</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            {/*{accessRight === 1 && (*/}
                                            {/*    <Col span={12}>*/}
                                            {/*        <Form.Item*/}
                                            {/*            name="restricted_access_detail"*/}
                                            {/*            label="Детали закрытого доступа"*/}
                                            {/*        >*/}
                                            {/*            <Input placeholder="Введите детали закрытого доступа" />*/}
                                            {/*        </Form.Item>*/}
                                            {/*    </Col>*/}
                                            {/*)}*/}
                                        </Row>

                                        <Form.Item
                                            name="duration"
                                            label="Время прохождения"
                                            rules={[{required: true,message:"Время прохождения курса обязательно!"}]}
                                        >
                                            <Input placeholder="Введите время прохождения" type="number"/>
                                        </Form.Item>

                                        <Form.Item
                                            name="level"
                                            label="Уровень сложности"
                                            rules={[{required: true,message:"Уровень сложности курса обязательно!"}]}
                                        >
                                            <Select>
                                                {LEVEL_COURSE.map(level => (
                                                    <Select.Option key={level.id} value={level.id}>{level.title}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="content_description"
                                            label="Содержание курса"
                                        >
                                            <ReactQuill theme="snow"/>
                                        </Form.Item>

                                        <div className="flex flex-col items-center">
                                            <Form.Item style={{marginTop: '10px'}}>
                                                <Button type="primary" htmlType="submit" loading={courseStore.loadingCreateCourse}>Редактировать</Button>
                                            </Form.Item>
                                        </div>
                                    </> : <Spin/>
                                }
                            </Form>
                        },
                        {
                            label: 'Разделы и компоненты',
                            key: '2',
                            children: <div className="p-2">
                                {
                                    courseStore.courseDetailsSections?.length > 0
                                        ? <Collapse size="large" ghost items={courseStore.courseDetailsSections?.map(item => (
                                        {
                                            key: item.id,
                                            label: item.name,
                                            children: <div key={item.id} className="bg-gray-100 rounded p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-col">
                                                        <div className="text-xl text-gray-800">
                                                            <p>Описание</p>
                                                        </div>
                                                        <span className="ml-2">{item.description}</span>
                                                    </div>
                                                    <Tooltip title="Время создания">
                                                        {dayjs(item.created_at).format(FORMAT_VIEW_DATE)}
                                                    </Tooltip>
                                                </div>
                                                <Divider/>
                                                <h1>Компоненты</h1>
                                                <Divider/>
                                                <Collapse items={item.components.map(component => ({
                                                    key: component.id,
                                                    label: component.title,
                                                    children: <div key={component.id}>
                                                        <div>
                                                            {component.description}
                                                        </div>
                                                    </div>
                                                }))}/>
                                            </div>,
                                        }
                                    ))} />
                                        : <Empty description={<div>
                                            <p>Список пуст</p>
                                            <Link href={"/control-panel/sections/add"}>
                                                <Button
                                                    className="mt-2 transition-transform transform hover:scale-105"
                                                    type="primary"
                                                    icon={<PlusCircleOutlined/>}
                                                >Создать раздел
                                                </Button>
                                            </Link>

                                        </div>}/>
                                }
                            </div>,
                        },
                        {
                            label: 'Дополнительные настройки',
                            key: '3',
                            children: (
                                <>
                                    <div style={{ padding: '10px 0', borderBottom: '1px solid #ddd', marginBottom: 10 }}>
                                        <h3 style={{ marginBottom: 10 }}>⚙️ Управление доступом</h3>
                                        <Switch
                                            checked={isCourseLocked}
                                            onChange={handleLockToggle}
                                            checkedChildren="Курс заблокирован"
                                            unCheckedChildren="Курс открыт"
                                        />
                                        <p style={{ marginTop: 10, fontStyle: 'italic' }}>
                                            {isCourseLocked 
                                                ? '🔒 Доступ к курсу ограничен для новых участников.' 
                                                : '🔓 Курс открыт для регистрации и доступен всем желающим.'}
                                        </p>
                                    </div>
                                    <div style={{ padding: '10px 0', borderBottom: '1px solid #ddd', marginBottom: 10 }}>
                                        <h3 style={{ marginBottom: 10 }}>🗑️ Управление участниками</h3>
                                        <Button 
                                            danger 
                                            onClick={handleDeleteParticipants}
                                            style={{ marginBottom: 10 }}
                                        >
                                            Удалить всех участников
                                        </Button>
                                        <p style={{ fontSize: '14px', color: 'gray' }}>
                                            Это действие необратимо! Убедитесь, что вы уверены в удалении.
                                        </p>
                                    </div>
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
                                    <div style={{ padding: '10px 0' }}>
                                        <h3 style={{ marginBottom: 10 }}>📅 Настройки расписания</h3>
                                        <Button 
                                            type="primary" 
                                            
                                            style={{ marginRight: 10 }}
                                        >
                                            Настроить расписание курса
                                        </Button>
                                        <Button 
                                            type="default" 
                                        >
                                            Управление уведомлениями
                                        </Button>
                                    </div>
                                </>
                            )
                        },
                        
                    ]}
                />
            </div>
        </div>
    )
}
export default observer(CoursePage);