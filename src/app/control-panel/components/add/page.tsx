"use client"
import { Breadcrumb, Button, Divider, Form, Select } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { lazy, Suspense, useState } from "react"

import { PageContainerControlPanel } from "@/shared/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import { CourseComponentType } from "@/shared/api/component/model";
import {ComponentTask} from "@/shared/api/course/model";

const TextTask = lazy(() => import("@/entities/course/ui").then(module => ({ default: module.TextTask })));

const QuizTask = lazy(() => import("@/entities/course/ui").then(module => ({ default: module.QuizTask })));
const MultiPlayChoice = lazy(() => import("@/entities/course/ui").then(module => ({ default: module.MultiPlayChoice })));
const TaskWithFormula =lazy(() => import("@/entities/course/ui").then(module => ({ default: module.TaskWithFormula })));

const TaskAddPage = () => {
    const { courseComponentStore } = useMobxStores()
    const [form] = Form.useForm<ComponentTask>();
    const router = useRouter();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)

    const onFinish = (values: ComponentTask) => {
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
                    <Button color="blue" variant="solid" htmlType="submit" loading={courseComponentStore.createLoading}>Добавить</Button>
                </Form.Item>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(TaskAddPage);