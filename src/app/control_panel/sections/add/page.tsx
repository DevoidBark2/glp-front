"use client"
import {Breadcrumb, Button, Card, Col, Flex, Form, message, notification, Row, Select, Steps, UploadProps} from "antd";
import {useMobxStores} from "@/stores/stores";
import {Input} from "antd/lib";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {observer} from "mobx-react";
import Link from "next/link";
import FirstStep from "@/components/CreateSectionSteps/FirstStep";
import SecondStep from "@/components/CreateSectionSteps/SecondStep";
import {Course} from "@/stores/CourseStore";
import {showCourseStatus} from "@/utils/showCourseStatusInTable";

const SectionAddPage = () => {

    const {courseStore} = useMobxStores();
    const [createCourseForm] = Form.useForm();
    const router = useRouter();

    const steps = [
        {
            title: 'First',
            content: <FirstStep></FirstStep>,
        },
        {
            title: 'Second',
            content: <SecondStep></SecondStep>,
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const [current, setCurrent] = useState(0);

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const handleCourseChange = (value: number) => {
        const course = courseStore.teacherCourses.find(item => item.id === value);
        setSelectedCourse(course!);
    };

    useEffect(() => {
        courseStore.getCoursesForCreator();
    }, []);

    return(
        <div className="bg-white h-full p-5 overflow-y-auto overflow-x-hidden">
            <Breadcrumb items={[ {
                title: <Link href={"/control_panel/sections"}>Разделы</Link>,
            },{
                title: <p>Новый раздел</p>,
            }]}/>
            <h1 className="text-center text-3xl">Добавление раздела</h1>

            <Steps current={current} items={items} />
            <div>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
            <Input placeholder="Введите название..."/>
            <Row gutter={16}>
                {/* Left Side - Input and Select */}
                <Col span={12}>
                    <Input placeholder="Введите название..." />
                    <Select
                        placeholder="Выберите курс"
                        style={{ width: '100%', marginTop: '10px' }}
                        onChange={handleCourseChange}
                    >
                        {courseStore.teacherCourses.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Col>

                {/* Right Side - Display Selected Course */}
                <Col span={12}>
                    {selectedCourse && (
                        <Card
                            title={selectedCourse.name}
                            bordered={false}
                            style={{ width: '100%', marginTop: '10px' }}
                            cover={
                                <img
                                    alt={selectedCourse.name}
                                    src={selectedCourse.image}
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                />
                            }
                        >
                            <p><strong>Категория:</strong> {selectedCourse.category.name}</p>
                            <p><strong>Уровень:</strong> {selectedCourse.level}</p>
                            <p><strong>Длительность:</strong> {selectedCourse.duration} часов</p>
                            <p><strong>Описание:</strong> {selectedCourse.small_description}</p>
                            <p><strong>Статус:</strong> {showCourseStatus(selectedCourse.status)}</p>
                            <p><strong>Права доступа:</strong> {selectedCourse.access_right === 0 ? 'Открытый' : 'Закрытый'}</p>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default observer(SectionAddPage);