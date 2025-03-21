"use client"
import { Button, notification, Table, TableColumnsType } from "antd";
import { observer } from "mobx-react";
import { useParams, useRouter } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { DragAndDropComponents, DragHandle, Row } from "@/entities/course/ui";
import { SectionCourseItem } from "@/shared/api/section/model";
import { useMobxStores } from "@/shared/store/RootStore";

interface ParentColumn {
    id: number;
    title: string;
    sections: SectionCourseItem[],
    sort_number: number
    sectionId: number
}

export const CourseSections = observer(() => {
    const { courseId } = useParams();
    const { courseStore, sectionCourseStore } = useMobxStores();
    const router = useRouter();

    const handleDeleteComponent = (componentId: string, sectionId: number) => { };

    const handleDragDropComponent = (result: any, record: SectionCourseItem) => {
        if (!result.destination) {return;}

        const sectionId = record.id;
        const updatedComponents = [...record.sectionComponents];
        const [movedComponent] = updatedComponents.splice(result.source.index, 1);
        updatedComponents.splice(result.destination.index, 0, movedComponent);

        updatedComponents.forEach((component, index) => {
            component.sort = index;
        });

        courseStore.updateSectionComponentsOrder(sectionId, updatedComponents);

        courseStore.updateComponentOrder(sectionId, updatedComponents.map((comp, index) => ({
            id: comp.id,
            sort: index
        }))).catch((e) => {
            notification.error({ message: e.response.data.message });
        });
    };

    const groupedSections = courseStore.courseDetailsSections.reduce((acc, section) => {
        const parentId = section.parentSection?.id;
        const parentTitle = section.parentSection?.title;
        const parentSort = section.sort_number;
        const sectionId = section.id;

        if (!acc[parentId]) {
            acc[parentId] = {
                id: parentId,
                title: parentTitle,
                sections: [],
                sort_number: parentSort,
                sectionId: sectionId
            };
        }

        acc[parentId].sections.push({
            ...section,
            sectionComponents: section.sectionComponents,
        });

        return acc;
    }, {} as Record<string, ParentColumn>);

    const parentColumns: TableColumnsType<ParentColumn> = [
        { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
        {
            title: "Родительский раздел",
            dataIndex: "title",
            key: "title",
            render: (title) => <strong>{title}</strong>,
        },
        {
            title: "Действия",
            width: 200,
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                    />
                </div>
            ),
        },
    ];

    const sectionColumns: TableColumnsType<SectionCourseItem> = [
        { key: 'sort', align: 'center', width: 80, render: () => <DragHandle /> },
        {
            title: "Название раздела",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Действия",
            width: "20%",
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                    />
                </div>
            ),
        },
    ];

    const [parentSections, setParentSections] = React.useState<ParentColumn[]>(Object.values(groupedSections).sort((a, b) => a.sort_number - b.sort_number));

    const onDragEndParentSection = async ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) {return;}

        // Обновляем состояние и получаем новое значение
        const updatedSections = await new Promise<ParentColumn[]>((resolve) => {
            setParentSections((prevState) => {
                const activeIndex = prevState.findIndex((record) => record.id === active.id);
                const overIndex = prevState.findIndex((record) => record.id === over.id);
                const newState = arrayMove(prevState, activeIndex, overIndex);
                resolve(newState);
                return newState;
            });
        });

        // Создаем массив с актуальными данными
        const updatedOrder = updatedSections.map((section, index) => ({
            id: section.id,
            sectionId: section.sectionId,
            sort: index
        }));

        // Обновляем порядок секций в хранилище
        await courseStore.updateParentSectionsOrder(Number(courseId), updatedOrder);
    };


    const onDragEndSection = async ({ active, over }: DragEndEvent, parentId: number) => {
        if (active.id !== over?.id) {
            // Обновляем состояние и получаем новое значение
            const updatedParentSections = await new Promise<ParentColumn[]>((resolve) => {
                setParentSections((prevState) => {
                    const parentIndex = prevState.findIndex((record) => record.id === parentId);
                    if (parentIndex === -1) {return prevState;}

                    const updatedParent = { ...prevState[parentIndex] };
                    const activeIndex = updatedParent.sections.findIndex((record) => record.id === active?.id);
                    const overIndex = updatedParent.sections.findIndex((record) => record.id === over?.id);

                    updatedParent.sections = arrayMove(updatedParent.sections, activeIndex, overIndex);

                    const newParentSections = [...prevState];
                    newParentSections[parentIndex] = updatedParent;

                    resolve(newParentSections);
                    return newParentSections;
                });
            });

            // Создаем массив с актуальными данными для секций
            const updatedSectionOrder = updatedParentSections
                .find((section) => section.id === parentId)
                ?.sections.map((section, index) => ({
                    id: section.id,
                    sort: index,
                }));

            if (updatedSectionOrder) {
                debugger
                // await courseStore.updateSectionOrder(Number(courseId), parentId, updatedSectionOrder);
            }
        }
    };



    return (
        <div className="p-2">
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEndParentSection}>
                <SortableContext items={parentSections.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <Table<ParentColumn>
                        rowKey={(record) => record.id}
                        bordered
                        pagination={false}
                        components={{ body: { row: Row } }}
                        columns={parentColumns}
                        dataSource={parentSections}
                        expandable={{
                            expandedRowRender: (parentRecord) => (
                                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={(event) => onDragEndSection(event, parentRecord.id)}>
                                    <SortableContext items={parentRecord.sections.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                        <Table<SectionCourseItem>
                                            dataSource={parentRecord.sections.map(section => ({
                                                ...section,
                                                key: section.id,
                                            }))}
                                            columns={sectionColumns}
                                            components={{ body: { row: Row } }}
                                            pagination={false}
                                            rowKey={(record) => record.id}
                                            expandable={{
                                                expandedRowRender: (section) =>
                                                    section.sectionComponents?.length > 0 ? (
                                                        <DragAndDropComponents
                                                            handleDragDropComponent={handleDragDropComponent}
                                                            handleDeleteComponent={handleDeleteComponent}
                                                            section={section}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-500">Нет компонентов</span>
                                                    ),
                                            }}
                                        />
                                    </SortableContext>
                                </DndContext>
                            ),
                        }}
                    />
                </SortableContext>
            </DndContext>
        </div>
    );
});