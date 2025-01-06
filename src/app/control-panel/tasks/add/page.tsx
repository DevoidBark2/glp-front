"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model"
import { useMobxStores } from "@/stores/stores"
import { Breadcrumb, Button, Divider, Form, message, Select } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MultiPlayChoice, QuizTask, TextTask } from "@/entities/course/ui";
import TaskWithFormula from "@/entities/course/ui/CreateTask/TaskWithFormula";

const TaskAddPage = () => {
    const { courseComponentStore } = useMobxStores()
    const [form] = Form.useForm<CourseComponentTypeI>();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [options, setOptions] = useState<Record<number, string[]>>({});
    const router = useRouter();

    const handleValuesChange = (_: CourseComponentType, allValues: CourseComponentTypeI) => {
        const updatedOptions = allValues.questions?.reduce<Record<number, string[]>>((acc, question, index: number) => {
            acc[index] = question?.options || [];
            return acc;
        }, {});
        setOptions(updatedOptions);
    };
    const onFinish = (values: CourseComponentTypeI) => {
        if (values.type !== CourseComponentType.Text && (!values.questions || values.questions.length === 0)) {
            message.warning("Вопрос должен быть хотя бы 1!");
            return;
        }

        courseComponentStore.addComponentCourse(values).finally(() => {
            form.resetFields();
            router.push('/control-panel/tasks')
            courseComponentStore.setCreateLoading(false)
        });
    }

    const latexFormula = `
    \\[
    \\int_{a}^{b} \\left( \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}} \\right) dx = 
    \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} e^{i n x}
    \\]
    `;
    
    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[{
                    title: <Link href={"/control-panel/tasks"}>Доступные компоненты</Link>,
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
                        <Select.Option value={CourseComponentType.SimpleTask}>Простая задача</Select.Option>
                        <Select.Option value={CourseComponentType.Quiz}>Квиз</Select.Option>
                        <Select.Option value={CourseComponentType.MultiPlayChoice}>Множестенный выбор</Select.Option>
                    </Select>
                </Form.Item>

                {typeTask === CourseComponentType.Text && <TextTask />}
                {typeTask === CourseComponentType.Quiz && <QuizTask form={form} />}
                {typeTask === CourseComponentType.MultiPlayChoice && <MultiPlayChoice form={form} />}
                {typeTask === CourseComponentType.SimpleTask && <TaskWithFormula />}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={courseComponentStore.createLoading}>Добавить</Button>
                </Form.Item>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(TaskAddPage);