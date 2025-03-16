"use client"
import { Breadcrumb, Button, Divider, Form, Select, Spin, Tag } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import {PageContainerControlPanel} from "@/shared/ui";
import {MultiPlayChoice, QuizTask, TextTask} from "@/entities/course/ui";
import TaskWithFormula from "@/entities/course/ui/CreateTask/TaskWithFormula";
import {useMobxStores} from "@/shared/store/RootStore";
import {CourseComponent, CourseComponentType, StatusCourseComponentEnum} from "@/shared/api/component/model";

const ComponentPage = () => {
    const { courseComponentStore } = useMobxStores()
    const { componentId } = useParams();
    const [form] = Form.useForm<CourseComponent>();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [changedComponent, setChangedComponent] = useState<CourseComponent | null>(null)
    const [options, setOptions] = useState<Record<number, string[]>>({});

    const onFinish = (values: CourseComponent) => {
        courseComponentStore.changeComponent(values)
    }

    const handleValuesChange = (_: CourseComponentType, allValues: CourseComponent) => {
        const updatedOptions = allValues.questions?.reduce<Record<number, string[]>>((acc, question, index: number) => {
            acc[index] = question?.options || [];
            return acc;
        }, {});
        setOptions(updatedOptions!);
    };

    useEffect(() => {
        const fetchData = async () => {
            const component = await courseComponentStore.getComponentById(String(componentId));
            form.setFieldsValue(component!);
            setChangedComponent(component!);
            setTypeTask(component!.type);
            const initialOptions = component.questions?.reduce((acc, question, index) => {
                acc[index] = question.options || [];
                return acc;
            }, {} as Record<number, string[]>) || {};

            setOptions(initialOptions);
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
                    <Button type="primary" htmlType="submit">Изменить</Button>
                </Form.Item>
               </> : <Spin/>}
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(ComponentPage);