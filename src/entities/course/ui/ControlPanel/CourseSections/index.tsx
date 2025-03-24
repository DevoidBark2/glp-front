"use client"
import {Button, Modal, notification, Table, TableColumnsType} from "antd";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";
import React, {useState} from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { DragAndDropComponents, DragHandle, Row } from "@/entities/course/ui";
import { SectionCourseItem } from "@/shared/api/section/model";
import { useMobxStores } from "@/shared/store/RootStore";
import {sectionsTable} from "@/shared/config";

export interface ParentColumn {
    id: number;
    title: string;
    sections: SectionCourseItem[],
    sort: number
    sectionId: number
}

export const CourseSections = observer(() => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [openModalDeleteParentSection, setOpenModalDeleteParentSection] = useState(false);
    const [openModalDeleteSection, setOpenModalDeleteSection] = useState(false);
    const [selectedParentSectionId, setSelectedParentSectionId] = useState<number | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);


    const handleDeleteParentSection = (parentId: number) => {
        courseStore.deleteParentSection(Number(courseId), parentId).then(response => {
            notification.success({message: response.message})
            setSelectedParentSectionId(null)
            setOpenModalDeleteParentSection(false)
        })
    }

    const handleDeleteSection = (sectionId: number) => {
        courseStore.deleteSection(Number(courseId), sectionId).then(response => {
            notification.success({message: response.message})
            setSelectedSectionId(null)
            setOpenModalDeleteSection(false)
        });
    }

    const handleDeleteComponent = (componentId: string, sectionId: number) => {
        courseStore.deleteComponent(componentId, sectionId).then(response => {
            notification.success({message: response.message})
        })
    };

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
                        onClick={() => {
                            setOpenModalDeleteParentSection(true)
                            setSelectedParentSectionId(record.id)
                        }}
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
                        onClick={() => {
                            setOpenModalDeleteSection(true)
                            setSelectedSectionId(record.id)
                        }}
                        icon={<DeleteOutlined />}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Modal
                centered
                zIndex={10000}
                open={openModalDeleteSection}
                onCancel={() => {
                    setOpenModalDeleteSection(false)
                    setSelectedSectionId(null)
                }}
                title="Удаление раздела"
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setOpenModalDeleteSection(false)
                            setSelectedSectionId(null)
                        }}
                    >
                        Отменить
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        onClick={() => handleDeleteSection(selectedSectionId!)}
                    >
                        Удалить
                    </Button>
                ]}
            >
                <div>
                    <h3 className="text-[#FF4D4F] font-bold text-center mb-2">
                        Внимание! Вы уверены, что хотите удалить раздел?
                    </h3>
                    <p className="text-[#595959] text-center mb-3">
                        После удаления раздела все дополнительные материалы (включая прикрепленные файлы и изображения), связанные с ним,
                        будут удалены. Это действие невозможно отменить.
                    </p>
                </div>
            </Modal>

            <Modal
                zIndex={10000}
                centered
                open={openModalDeleteParentSection}
                onCancel={() => {
                    setOpenModalDeleteParentSection(false)
                    setSelectedParentSectionId(null)
                }}
                title="Удаление родительского раздела"
                footer={[
                    <Button key="cancel" onClick={() => {
                        setOpenModalDeleteParentSection(false)
                        setSelectedParentSectionId(null)
                    }}>
                        Отменить
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        onClick={() => handleDeleteParentSection(selectedParentSectionId!)}
                    >
                        Удалить
                    </Button>
                ]}
            >
                <div>
                    <h3 className="text-[#FF4D4F] font-bold text-center mb-2">
                        Внимание! Вы уверены, что хотите удалить все дочерние разделы?
                    </h3>
                    <p className="text-[#595959] text-center">
                        После удаления родительский раздел останется в системе, но все дочерние разделы
                        будут удалены. Это действие невозможно отменить.
                    </p>
                </div>
            </Modal>

            <div className="p-2">
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={({active,over}) => courseStore.onDragEndParentSection({active,over} as DragEndEvent, Number(courseId))}>
                    <SortableContext items={Object.values(courseStore.groupedSections).sort((a, b) => a.sort - b.sort).map((i) => i.id)} strategy={verticalListSortingStrategy}>
                        <Table<ParentColumn>
                            rowKey={(record) => record.id}
                            bordered
                            locale={sectionsTable}
                            pagination={false}
                            components={{ body: { row: Row } }}
                            columns={parentColumns}
                            dataSource={Object.values(courseStore.groupedSections).sort((a, b) => a.sort - b.sort)}
                            expandable={{
                                expandedRowRender: (parentRecord) => (
                                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={(event) => courseStore.onDragEndSection(event, parentRecord.id,Number(courseId))}>
                                        <SortableContext items={parentRecord.sections.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                            <Table<SectionCourseItem>
                                                dataSource={parentRecord.sections.map(section => ({
                                                    ...section,
                                                    key: section.id,
                                                })).sort((a,b) => a.sort - b.sort)}
                                                columns={sectionColumns}
                                                components={{ body: { row: Row } }}
                                                bordered
                                                pagination={false}
                                                rowKey={(record) => record.id}
                                                expandable={{
                                                    expandedRowRender: (section) =>
                                                        section.sectionComponents?.length > 0 ? (
                                                            <DragAndDropComponents
                                                                handleDragDropComponent={courseStore.handleDragDropComponent}
                                                                handleDeleteComponent={handleDeleteComponent}
                                                                section={section}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                Этот раздел неполный, поскольку в нем отсутствуют компоненты.
                                                                Пожалуйста, добавьте компоненты для полноценного функционирования.
                                                            </span>
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
        </>
    );
});