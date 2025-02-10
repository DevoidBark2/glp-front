"use client"
import React, { useState } from "react";
import { PageContainerControlPanel } from "@/shared/ui";
import {Divider, Breadcrumb, Input, AutoComplete, Button, Tag, message, notification, Empty} from "antd";
import { useMobxStores } from "@/shared/store/RootStore";
import Link from "next/link";
import { observer } from "mobx-react";
import { DeleteOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { typeIcons } from "@/shared/columnsTables/taskColumns";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import {useRouter} from "next/navigation";
import {StatusCourseComponentEnum} from "@/shared/api/component/model";
import {renderType} from "@/shared/lib/course/course.lib";

const ExamAddPage = observer(() => {
    const { courseComponentStore, examStore } = useMobxStores();
    const [addedComponents, setAddedComponents] = useState<any[]>([]);
    const [examTitle, setExamTitle] = useState("");
    const router = useRouter();

    const handleSelect = (_: string, option: any) => {
        const selectedComponent = courseComponentStore.searchResults.find(component => component.id === option.key);

        if (selectedComponent && !addedComponents.some(component => component.id === selectedComponent.id)) {
            // Присваиваем сортировку в зависимости от текущей длины массива addedComponents
            selectedComponent.sort = addedComponents.length;  // Присваиваем текущий индекс
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

    const handleDeleteComponent = (id: string) => {
        setAddedComponents(prev => prev.filter(component => component.id !== id));
    };

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        const items = Array.from(addedComponents);
        const [removed] = items.splice(source.index, 1);
        items.splice(destination.index, 0, removed);

        // Обновляем сортировку для всех компонентов
        const updatedItems = items.map((item, index) => ({
            ...item,
            sort: index,  // Обновляем сортировку по индексу
        }));

        setAddedComponents(updatedItems);
    };

    const handleCreateExam = () => {
        if (!examTitle) {
            message.warning("Пожалуйста, введите заголовок экзамена.");
            return;
        }

        examStore.createExam(examTitle, addedComponents).then((response) => {
            notification.success({message: response.message})
            router.push("/control-panel/exams");
        });
    };

    return (
        <PageContainerControlPanel>
            <div className="p-4">
                <Breadcrumb
                    items={[
                        {
                            title: <Link href={"/control-panel/exams"}>Доступные экзамены</Link>,
                        },
                        {
                            title: "Новый экзамен",
                        },
                    ]}
                />
                <div className="flex justify-center items-center">
                    <h1 className="text-center text-3xl">Создание экзамена</h1>
                </div>
                <Divider/>

                <div className="mb-4">
                    <p className="text-gray-800 text-lg">Заголовок для экзамена</p>
                    <Input
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                        placeholder="Введите заголовок экзамена"
                        style={{width: '100%'}}
                    />
                </div>

                <AutoComplete
                    style={{width: '100%'}}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    options={
                        courseComponentStore.searchResults.length > 0
                            ? courseComponentStore.searchResults.map(component => ({
                                value: component.title,
                                label: (
                                    <div className="flex items-center p-2 border-b-2">
                                        <div style={{flex: 1}}>
                                            <strong>{component.title}</strong>
                                            <div style={{color: 'grey', fontSize: '12px'}}>{component.description}</div>
                                        </div>
                                        <div style={{marginLeft: '8px'}}>
                                            {renderType(component.type)}
                                        </div>
                                    </div>
                                ),
                                key: component.id,
                            }))
                            : [
                                {
                                    value: 'empty',
                                    label: <div style={{textAlign: 'center', padding: '8px', color: 'grey'}}>Список
                                        пуст</div>,
                                    disabled: true,
                                },
                            ]
                    }
                    placeholder="Введите название или тег..."
                >
                    <Input.Search/>
                </AutoComplete>

                <p className="text-gray-800 text-lg">Вопросы в экзамене</p>
                {addedComponents.length > 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable-list">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {addedComponents.map((component, index) => (
                                        <Draggable key={component.id} draggableId={String(component.id)} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow mb-2 mt-2"
                                                >
                                                    <div className="flex items-center justify-between">
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
                                                        Тип:
                                                        <Tag className="ml-2" icon={typeIcons[component.type]}>
                                                            <span>{component.type}</span>
                                                        </Tag>
                                                    </span>
                                                        <span className="block mb-1">
                                                        Статус:
                                                        <Tag
                                                            color={component.status === StatusCourseComponentEnum.ACTIVATED ? "green" : "red"}
                                                        >
                                                            {component.status === StatusCourseComponentEnum.ACTIVATED ? "Активен" : "Неактивен"}
                                                        </Tag>
                                                    </span>
                                                        <span>
                                                        Создано: {dayjs(component.created_at).format(FORMAT_VIEW_DATE)}
                                                    </span>
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
                ): <Empty description="Список пуст"/>}

                <div className="mt-4 text-center">
                    <Button type="primary" onClick={handleCreateExam}>
                        Создать экзамен
                    </Button>
                </div>
            </div>
        </PageContainerControlPanel>
    );
});

export default ExamAddPage;
