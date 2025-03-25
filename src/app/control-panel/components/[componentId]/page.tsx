"use client"
import {Breadcrumb, Button, Divider, Form, Input, notification, Select, Spin, Tag} from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"

import {PageContainerControlPanel} from "@/shared/ui";
import {MultiPlayChoice, QuizTask, TextTask} from "@/entities/course/ui";
import {TaskWithFormula} from "@/entities/course/ui/CreateTask/TaskWithFormula";
import {useMobxStores} from "@/shared/store/RootStore";
import {CourseComponentType, StatusCourseComponentEnum} from "@/shared/api/component/model";
import {ComponentTask} from "@/shared/api/course/model";

const ComponentPage = () => {
    const { courseComponentStore } = useMobxStores()
    const { componentId } = useParams();
    const [form] = Form.useForm<ComponentTask>();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [changedComponent, setChangedComponent] = useState<ComponentTask | null>(null)

    const onFinish = (values: ComponentTask) => {
        courseComponentStore.changeComponent(values).then(response => {
            notification.success({ message: response! })
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            const component = await courseComponentStore.getComponentById(String(componentId));
            form.setFieldsValue(component!);
            setChangedComponent(component!);
            setTypeTask(component!.type);
        }

        fetchData();
    }, [])

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[{
                    title: <Link href={"/control-panel/components"}>Доступные компоненты</Link>,
                }, {
                    title: changedComponent?.title,
                }]}
            />
            <h1 className="text-center text-3xl">Изменение компонента</h1>
            <Divider />
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onValuesChange={() => {
                    const componentTask = form.getFieldValue("componentTask") || {};
                    const updatedQuestions = componentTask.questions || [];

                    const newComponentTask = {
                        ...componentTask,
                        questions: updatedQuestions.map((question: any) => {
                            const currentOptions = question?.options || [];
                            return { ...question, options: currentOptions };
                        })
                    };

                    form.setFieldsValue({ componentTask: newComponentTask });
                }}
            >
               {!courseComponentStore.loadingCourseComponent ?  <>
                {changedComponent && <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>}
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
                        <Select.Option value={CourseComponentType.SimpleTask}>Простая задача</Select.Option>
                        <Select.Option value={CourseComponentType.Quiz}>Квиз</Select.Option>
                        <Select.Option value={CourseComponentType.MultiPlayChoice}>Множестенный выбор</Select.Option>
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
                            <Select.Option value={StatusCourseComponentEnum.ACTIVATED}>
                                <Tag color="green">Активен</Tag>
                            </Select.Option>
                            <Select.Option value={StatusCourseComponentEnum.DEACTIVATED}>
                                <Tag color="red">Неактивен</Tag>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                }

                {typeTask === CourseComponentType.Text && <TextTask />}
                {typeTask === CourseComponentType.Quiz && <QuizTask form={form} />}
                {typeTask === CourseComponentType.MultiPlayChoice && <MultiPlayChoice form={form} />}
                {typeTask === CourseComponentType.SimpleTask && <TaskWithFormula form={form} />}

                <Form.Item>
                    <Button variant="solid" color="blue" type="primary" htmlType="submit">Изменить</Button>
                </Form.Item>
               </> : <Spin/>}
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(ComponentPage);