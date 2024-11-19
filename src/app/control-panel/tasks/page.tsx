"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    message,
    Modal,
    Select,
    Table,
    Tag,
} from "antd";
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import { CourseComponentTypeI } from "@/stores/CourseComponent";
import PageHeader from "@/components/PageHeader/PageHeader";
import TextTask from "@/components/CourseComponentTask/TaskTypes/TextTask";
import QuizTask from "@/components/CourseComponentTask/TaskTypes/QuizTask";
import MultiPlayChoise from "@/components/CourseComponentTask/TaskTypes/MultiPlayChoiceTask";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { taskColumns } from "@/columnsTables/taskColumns";
import { taskTable } from "@/shared/config";
import { CourseComponentType } from "@/shared/api/course/model";
import { StatusComponentTaskEnum } from "@/shared/api/component-task";

const TaskPage = () => {
    const { courseComponentStore } = useMobxStores()
    const [form] = Form.useForm<CourseComponentTypeI>();
    const [typeTask, setTypeTask] = useState<CourseComponentType | null>(null)
    const [changedComponent, setChangedComponent] = useState<number | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [options, setOptions] = useState<Record<number, string[]>>({});

    const handleChangeComponentTask = (record: CourseComponentTypeI) => {
        form.setFieldsValue(record);
        setChangedComponent(record.id);
        setTypeTask(record.type);
        setOptions(record.questions?.reduce((acc, question, index) => {
            acc[index] = question.options || [];
            return acc;
        }, {} as Record<number, string[]>));
        setIsModalVisible(true);
    }

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

        const action = changedComponent 
            ? courseComponentStore.changeComponent(values) 
            : courseComponentStore.addComponentCourse(values);

        action.finally(() => {
            form.resetFields();
            setTypeTask(null);
            setChangedComponent(null);
            setIsModalVisible(false);
        });
    }

    const handleCancelAddComponent = () => {
        form.resetFields();
        setChangedComponent(null);
        setTypeTask(null);
        setIsModalVisible(false);
    };

    useEffect(() => {
        courseComponentStore.getAllComponent();
    }, []);

    return (
        <PageContainerControlPanel>
            <Modal
                title={changedComponent ? "Изменить компонент" : "Новый компонент"}
                open={isModalVisible}
                onCancel={handleCancelAddComponent}
                width={600}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                    onValuesChange={handleValuesChange}
                >
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
                            <Select.Option value={CourseComponentType.Quiz}>Квиз</Select.Option>
                            <Select.Option value={CourseComponentType.MultiPlayChoice}>Множестенный выбор</Select.Option>
                            {/* <Select.Option value={CourseComponentType.Coding}>Программирование</Select.Option> */}
                            {/*<Select.Option value={CourseComponentType.Matching}>Соответствие</Select.Option>*/}
                            {/*<Select.Option value={CourseComponentType.Sequencing}>Последовательность</Select.Option>*/}
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
                    {typeTask === CourseComponentType.Quiz && <QuizTask options={options} />}
                    {typeTask === CourseComponentType.MultiPlayChoice && <MultiPlayChoise form={form} />}

                    <Form.Item>
                        <Button type="primary" htmlType="submit">{changedComponent ? "Изменить" : "Добавить"}</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <PageHeader
                title="Доступные компоненты"
                buttonTitle="Добавить компонент"
                onClickButton={() => setIsModalVisible(true)}
                showBottomDivider
            />
            <Table
                rowKey={(record) => record.id}
                loading={courseComponentStore.loadingCourseComponent}
                dataSource={courseComponentStore.courseComponents}
                columns={taskColumns({
                    handleChangeComponent: handleChangeComponentTask,
                    handleDeleteComponent: courseComponentStore.deleteComponent
                })}
                locale={taskTable}
            />
        </PageContainerControlPanel>
    );
};

export default observer(TaskPage);
