"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model"
import { useMobxStores } from "@/stores/stores"
import { Breadcrumb, Button, Divider, Form, message, Select } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {MultiPlayChoice, QuizTask, TextTask} from "@/entities/course/ui";

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
        });
    }


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
                        <Select.Option value={CourseComponentType.Quiz}>Квиз</Select.Option>
                        <Select.Option value={CourseComponentType.MultiPlayChoice}>Множестенный выбор</Select.Option>
                        {/* <Select.Option value={CourseComponentType.Coding}>Программирование</Select.Option> */}
                        {/*<Select.Option value={CourseComponentType.Matching}>Соответствие</Select.Option>*/}
                        {/*<Select.Option value={CourseComponentType.Sequencing}>Последовательность</Select.Option>*/}
                    </Select>
                </Form.Item>

                {typeTask === CourseComponentType.Text && <TextTask />}
                {typeTask === CourseComponentType.Quiz && <QuizTask form={form} />}
                {typeTask === CourseComponentType.MultiPlayChoice && <MultiPlayChoice form={form} />}

                <Form.Item>
                    <Button type="primary" htmlType="submit">Добавить</Button>
                </Form.Item>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(TaskAddPage);