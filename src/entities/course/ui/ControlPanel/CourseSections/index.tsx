"use client"
import { useMobxStores } from "@/shared/store/RootStore";
import {Button, InputNumber, notification, Popconfirm, Table, TableColumnsType, Tooltip} from "antd";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { SectionCourseItem } from "@/shared/api/section/model";
import { DragAndDropComponents } from "@/entities/course/ui";
import {ArrowRightOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";

export const CourseSections = observer(() => {
    const { courseStore, sectionCourseStore } = useMobxStores();
    const router = useRouter();

    const handleChangeSection = (id: number) => {
        router.push(`/control-panel/sections/${id}`);
    };

    const handleDeleteSection = (id: number) => {
        sectionCourseStore.deleteSection(id).then(response => {
            courseStore.courseDetailsSections = courseStore.courseDetailsSections.filter(it => it.id !== id);
            notification.success({ message: response.message });
        });
    };

    const handleDeleteComponent = (componentId: string, sectionId: number) => {};

    const handleSortChange = (value: number, record: SectionCourseItem) => {
        if (value < 0) return;

        const updatedSections = courseStore.courseDetailsSections.map(section =>
            section.id === record.id ? { ...section, sort_number: value } : section
        );

        updatedSections.sort((a, b) => (a.sort_number || 0) - (b.sort_number || 0));
        courseStore.setCourseDetailsSections(updatedSections);
    };

    const handleDragDropComponent = (result: any, record: SectionCourseItem) => {
        if (!result.destination) return;

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
        debugger

        if (!acc[parentId]) {
            acc[parentId] = {
                id: parentId,
                title: parentTitle,
                sections: [],
                sort_number: parentSort
            };
        }

        acc[parentId].sections.push({
            ...section,
            sectionComponents: section.sectionComponents,
        });

        return acc;
    }, {} as Record<string, { id: number | string; title: string; sections: SectionCourseItem[]; sort_number: number }>);

    const parentColumns: TableColumnsType<{ id: number | string; title: string; sections: SectionCourseItem[], sort_number: number }> = [
        {
            title: "Сортировка",
            dataIndex: "sort_number",
            width:"5%",
            key: "sort_number",
            showSorterTooltip: false,
            sorter: (a, b) => a.sort_number - b.sort_number,
            render: (_, record) => (
                <InputNumber
                    min={0}
                    value={record.sort_number || 0}
                    onBlur={(e) => handleSortChangeParent(Number(e.target.value), record)}
                />
            ),
        },
        {
            title: "Родительский раздел",
            dataIndex: "title",
            key: "title",
            render: (title) => <strong>{title}</strong>,
        },
        {
            title: "Действия",
            width: "20%",
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Удалить весь раздел?">
                        <Popconfirm
                            title="Это действие нельзя отменить."
                            //onConfirm={() => nomenclatureStore.deleteCategory(record.id)}
                            okText="Удалить"
                            cancelText="Отменить"
                            placement="left"
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>

                </div>
            ),
        },
    ];

    const handleSortChangeParent = (value: number, record: { id: number | string; title: string; sections: SectionCourseItem[]; sort_number: number }) => {
        if (value < 0) return;

        // Обновляем данные в store
        const updatedSections = Object.values(groupedSections).map(parent =>
            parent.id === record.id ? { ...parent, sort_number: value } : parent
        );

        updatedSections.sort((a, b) => (a.sort_number || 0) - (b.sort_number || 0));

        // Обновляем в store
        courseStore.setCourseDetailsSections(
            updatedSections.flatMap(parent => parent.sections)
        );

        // отправка на бек
    };

    const sectionColumns: TableColumnsType<SectionCourseItem> = [
        {
            title: "Сортировка",
            dataIndex: "sort_number",
            key: "sort_number",
            width:"5%",
            showSorterTooltip: false,
            sorter: (a, b) => a.sort_number - b.sort_number,
            render: (_, record) => (
                <InputNumber min={0} value={record.sort_number || 0} onChange={(value) => handleSortChange(value!, record)} />
            ),
        },
        {
            title: "Название раздела",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Действия",
            width: "20%",
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Перейти в раздел">
                        <Button
                            icon={<ArrowRightOutlined />}
                            onClick={() => router.push(`/control-panel/sections/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить раздел">
                        <Popconfirm
                            title="Это действие нельзя отменить."
                            //onConfirm={() => nomenclatureStore.deleteCategory(record.id)}
                            okText="Удалить"
                            cancelText="Отменить"
                            placement="left"
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>

                </div>
            ),
        },
    ];

    return (
        <div className="p-2">
            {Object.keys(groupedSections).length > 0 ? (
                <Table
                    dataSource={Object.values(groupedSections)}
                    columns={parentColumns}
                    bordered
                    rowKey={(record) => record.id.toString()}
                    pagination={{ pageSize: 20 }}
                    expandable={{
                        expandedRowRender: (parentRecord) => (
                            <Table
                                dataSource={parentRecord.sections.map(section => ({
                                    ...section,
                                    key: section.id,
                                }))}
                                columns={sectionColumns}
                                rowKey={(record) => record.id.toString()}
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (section) =>
                                        section.sectionComponents.length > 0 ? (
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
                        ),
                    }}
                />
            ) : (
                <p>Нет данных</p>
            )}
        </div>
    );
});
