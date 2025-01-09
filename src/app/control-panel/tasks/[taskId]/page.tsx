"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { StatusComponentTaskEnum } from "@/shared/api/component-task"
import { CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model"
import { useMobxStores } from "@/stores/stores"
import { Breadcrumb, Button, Divider, Form, message, Select, Spin, Tag } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import {MultiPlayChoice, QuizTask, TextTask} from "@/entities/course/ui";
import TaskWithFormula from "@/entities/course/ui/CreateTask/TaskWithFormula";

const TaskDetailsPage = () => {
    const { courseComponentStore } = useMobxStores()
    const [form] = Form.useForm<CourseComponentTypeI>();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [changedComponent, setChangedComponent] = useState<CourseComponentTypeI | null>(null)
    const [options, setOptions] = useState<Record<number, string[]>>({});
    const { taskId } = useParams();

    const onFinish = (values: CourseComponentTypeI) => {
        // if (values.type !== CourseComponentType.Text && (!values.questions || values.questions.length === 0)) {
        //     message.warning("Вопрос должен быть хотя бы 1!");
        //     return;
        // }

        courseComponentStore.changeComponent(values)
    }

    const handleValuesChange = (_: CourseComponentType, allValues: CourseComponentTypeI) => {
        const updatedOptions = allValues.questions?.reduce<Record<number, string[]>>((acc, question, index: number) => {
            acc[index] = question?.options || [];
            return acc;
        }, {});
        setOptions(updatedOptions);
    };

    useEffect(() => {
        const fetchData = async () => {
            const component = await courseComponentStore.getComponentById(Number(taskId));
            form.setFieldsValue(component!);
            setChangedComponent(component!);
            setTypeTask(component!.type);
            setOptions(component!.questions?.reduce((acc, question, index) => {
                acc[index] = question.options || [];
                return acc;
            }, {} as Record<number, string[]>));
        }

        fetchData();
    }, [])
    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[{
                    title: <Link href={"/control-panel/tasks"}>Доступные компоненты</Link>,
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
                onValuesChange={handleValuesChange}
            >
               {!courseComponentStore.loadingCourseComponent ?  <>
                {changedComponent && <Form.Item name="id" hidden></Form.Item>}
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
                            <Select.Option value={StatusComponentTaskEnum.ACTIVATED}>
                                <Tag color="green">Активен</Tag>
                            </Select.Option>
                            <Select.Option value={StatusComponentTaskEnum.DEACTIVATED}>
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
                    <Button type="primary" htmlType="submit">Изменить</Button>
                </Form.Item>
               </> : <Spin/>}
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(TaskDetailsPage);