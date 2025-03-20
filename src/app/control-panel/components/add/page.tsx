"use client"
import { Breadcrumb, Button, Divider, Form, Select } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { lazy, Suspense, useState } from "react"

import { PageContainerControlPanel } from "@/shared/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import { CourseComponent, CourseComponentType } from "@/shared/api/component/model";

const TextTask = lazy(() => import("@/entities/course/ui").then(module => ({ default: module.TextTask })));

const QuizTask = lazy(() => import("@/entities/course/ui").then(module => ({ default: module.QuizTask })));
const MultiPlayChoice = lazy(() => import("@/entities/course/ui").then(module => ({ default: module.MultiPlayChoice })));
const TaskWithFormula =lazy(() => import("@/entities/course/ui").then(module => ({ default: module.TaskWithFormula })));

const TaskAddPage = () => {
    const { courseComponentStore } = useMobxStores()
    const [form] = Form.useForm<CourseComponent>();
    const router = useRouter();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [options, setOptions] = useState<Record<number, string[]>>({});

    const handleValuesChange = (_: CourseComponentType, allValues: CourseComponent) => {
        const updatedOptions = allValues.questions?.reduce<Record<number, string[]>>((acc, question, index: number) => {
            acc[index] = question?.options || [];
            return acc;
        }, {});
        setOptions(updatedOptions!);
    };

    const onFinish = (values: CourseComponent) => {
        courseComponentStore.addComponentCourse(values).finally(() => {
            form.resetFields();
            router.push('/control-panel/components')
            courseComponentStore.setCreateLoading(false)
        });
    }

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[{
                    title: <Link href={"/control-panel/components"}>Доступные компоненты</Link>,
                }, {
                    title: "Новый компонент",
                }]}
            />
            <h1 className="text-center text-3xl">Добавление компонента</h1>
            <Divider />
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
            >
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
                        <Select.Option value={CourseComponentType.MultiPlayChoice}>Множестенный выбор</Select.Option>
                        <Select.Option value={CourseComponentType.SimpleTask}>Текстовая задача</Select.Option>
                    </Select>
                </Form.Item>

                <Suspense fallback={<div>Загрузка...</div>}>
                    {typeTask === CourseComponentType.Text && <TextTask />}
                    {typeTask === CourseComponentType.Quiz && <QuizTask form={form} />}
                    {typeTask === CourseComponentType.MultiPlayChoice && <MultiPlayChoice form={form} />}
                    {typeTask === CourseComponentType.SimpleTask && <TaskWithFormula form={form} />}
                </Suspense>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={courseComponentStore.createLoading}>Добавить</Button>
                </Form.Item>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(TaskAddPage);