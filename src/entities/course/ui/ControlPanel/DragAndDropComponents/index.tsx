import React from "react";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {Button, Tag} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

import {typeIcons} from "@/shared/columnsTables/taskColumns";
import {StatusCourseComponentEnum} from "@/shared/api/component/model";
import {FORMAT_VIEW_DATE} from "@/shared/constants";
import {SectionCourseItem} from "@/shared/api/section/model";

interface DragAndDropComponentsProps {
    handleDragDropComponent: (result: DropResult, section: SectionCourseItem) => void;
    handleDeleteComponent: (componentId: string, sectionId: number) => void;
    section: SectionCourseItem;
}

export const DragAndDropComponents = ({handleDragDropComponent,handleDeleteComponent,section} : DragAndDropComponentsProps) => (
        <DragDropContext
            onDragEnd={(result) => handleDragDropComponent(result, section)}>
            <Droppable droppableId={`droppable-${section.id}`}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {section.sectionComponents.map((component, index) => (
                            <Draggable key={component.id}
                                       draggableId={String(component.id)}
                                       index={index}>
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
                                                {component.componentTask.title || "Нет заголовка"}
                                            </h4>
                                            <Button
                                                icon={<DeleteOutlined/>}
                                                type="primary"
                                                danger
                                                onClick={() => handleDeleteComponent(component.componentTask.id, section.id)}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                                                            <span className="block mb-1">
                                                                                Тип: {" "}
                                                                                <Tag className="ml-2"
                                                                                     icon={typeIcons[component.componentTask.type]}>
                                                                                    <span>{component.componentTask.type}</span>
                                                                                </Tag>
                                                                            </span>
                                            <span className="block mb-1">
                                                                                Статус: {" "}
                                                                                <Tag
                                                                                    color={component.componentTask.status === StatusCourseComponentEnum.ACTIVATED ? "green" : "red"}>
                                                                                    {component.componentTask.status === StatusCourseComponentEnum.ACTIVATED ? "Активен" : "Неактивен"}
                                                                                </Tag>
                                                                            </span>
                                            <span>Создано: {dayjs(component.componentTask.created_at).format(FORMAT_VIEW_DATE)}</span>
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
    )
