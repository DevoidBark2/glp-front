"use client"
import React, { useEffect, useState } from "react";
import {Divider, Breadcrumb, Input, Button, message, notification, Empty, Form, Tag, AutoComplete} from "antd";
import Link from "next/link";
import { observer } from "mobx-react";
import { DeleteOutlined } from "@ant-design/icons";
import {useParams} from "next/navigation";
import dayjs from "dayjs";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import { useMobxStores } from "@/shared/store/RootStore";
import { PageContainerControlPanel } from "@/shared/ui";
import { typeIcons } from "@/shared/columnsTables/taskColumns";
import { StatusCourseComponentEnum } from "@/shared/api/component/model";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import {renderType} from "@/shared/lib/course/course.lib";

const ExamPage = observer(() => {
    const [form] = Form.useForm();
    const { courseComponentStore, examStore } = useMobxStores();
    const { examId } = useParams();
    const [addedComponents, setAddedComponents] = useState<any[]>([]);

    const handleChangeExam = () => {
        debugger
        if(addedComponents.length < 1) {
            message.warning("Добавьте хотя бы один компонент в экзамен.")
            return;
        }

        examStore.changeExam(Number(examId), form.getFieldValue("title"), addedComponents).then((response) => {
            notification.success({message: response.message})
        });
    }

    const handleSelect = (_: string, option: any) => {
        const selectedComponent = courseComponentStore.searchResults.find(component => component.id === option.key);

        if (selectedComponent && !addedComponents.some(component => component.id === selectedComponent.id)) {
            selectedComponent.sort = addedComponents.length;
            setAddedComponents((prev) => [...prev, selectedComponent]);
        } else if (selectedComponent) {
            message.warning("Этот компонент уже был добавлен.");
        }
    };

    const handleSearch = (value: string) => {
        if (value && value.length > 2) {
            courseComponentStore.searchComponents(value);
        }
    };

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) {return;}

        const items = Array.from(addedComponents);
        const [removed] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);

        const updatedItems = items.map((item, index) => ({
            ...item,
            sort: index,
        }));

        setAddedComponents(updatedItems);
    };

    const handleDeleteComponent = (id: number) => {
        setAddedComponents(prev => prev.filter(component => component.id !== id));
    };

    useEffect(() => {
        if (examId) {
            examStore.getExamById(Number(examId)).then((data) => {
                form.setFieldsValue(examStore.currentExam)
                setAddedComponents(examStore.currentExam?.components!)
            }).catch(() => {
                message.error("Не удалось загрузить экзамен.");
            });
        }
    }, [examId, examStore]);

    return (
        <PageContainerControlPanel>
            <div className="p-4">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href="/control-panel/exams">Доступные экзамены</Link>,
                        },
                        {
                            title: examStore.currentExam?.title,
                        },
                    ]}
                />
                <div className="flex justify-center items-center">
                    <h1 className="text-center text-3xl">Просмотр экзамена</h1>
                </div>
                <Divider/>

                <Form form={form} layout="vertical" onFinish={handleChangeExam}>
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Заголовок для экзамена"
                        name="title"
                        rules={[{ required: true, message: "Введите заголовок экзамена" }]}
                    >
                        <Input placeholder="Введите заголовок экзамена" />
                    </Form.Item>

                    <Form.Item
                        label="Поиск компонетов"
                    >
                        <AutoComplete
                            style={{ width: '100%' }}
                            onSearch={handleSearch}
                            onSelect={handleSelect}
                            options={
                                courseComponentStore.searchResults.length > 0
                                    ? courseComponentStore.searchResults.map(component => ({
                                        value: component.title,
                                        label: (
                                            <div className="flex items-center justify-between p-2 border-b-2">
                                                <strong>{component.title}</strong>
                                                <div style={{ color: 'grey', fontSize: '12px' }}>{component.description}</div>
                                                {renderType(component.type)}
                                            </div>
                                        ),
                                        key: component.id,
                                    }))
                                    : [
                                        {
                                            value: 'empty',
                                            label: <div style={{ textAlign: 'center', padding: '8px', color: 'grey' }}>Список пуст</div>,
                                            disabled: true,
                                        },
                                    ]
                            }
                            placeholder="Введите название..."
                        />
                    </Form.Item>

                    <p className="text-gray-800 text-lg mt-3">Вопросы в экзамене</p>

                    {addedComponents.length > 0 ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {addedComponents.map((component, index) => (
                                            <Draggable key={component.id} draggableId={String(component.id)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow mb-2"
                                                    >
                                                        <div
                                                            className="flex items-center justify-between">
                                                            <h4 className="font-medium text-xl text-gray-800 mb-2">
                                                                {component.title || "Нет заголовка"}
                                                            </h4>
                                                            <Button
                                                                icon={<DeleteOutlined/>}
                                                                type="primary"
                                                                danger
                                                                onClick={() => handleDeleteComponent(component.id)}
                                                            />
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                                            <span className="block mb-1">
                                                                                Тип: {" "}
                                                                                <Tag className="ml-2"
                                                                                     icon={typeIcons[component.type]}>
                                                                                    <span>{component.type}</span>
                                                                                </Tag>
                                                                            </span>
                                                            <span className="block mb-1">
                                                                                Статус: {" "}
                                                                <Tag
                                                                    color={component.status === StatusCourseComponentEnum.ACTIVATED ? "green" : "red"}>
                                                                                    {component.status === StatusCourseComponentEnum.ACTIVATED ? "Активен" : "Неактивен"}
                                                                                </Tag>
                                                                            </span>
                                                            <span>Создано: {dayjs(component.created_at).format(FORMAT_VIEW_DATE)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : <Empty description="Список пуст" />}

                    <Divider/>

                    <div className="mt-4 text-center">
                        <Button color="blue" variant="solid" htmlType="submit">
                            Обновить экзамен
                        </Button>
                    </div>
                </Form>
            </div>
        </PageContainerControlPanel>
    );
});

export default ExamPage;