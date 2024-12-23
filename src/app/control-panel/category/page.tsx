"use client"
import { observer } from "mobx-react";
import { Button, Empty, Popconfirm, Table, TableColumnsType, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useMobxStores } from "@/stores/stores";
import {PageHeader} from "@/shared/ui/PageHeader";
import {PageContainerControlPanel} from "@/shared/ui";
import {CreateCategoryModal} from "@/entities/category/ui/CreateCategoryModal";
import {ChangeCategoryModal} from "@/entities/category/ui/ChangeCategoryModal";
import { NomenclatureItem } from "@/shared/api/nomenclature/model";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CategoryPage = () => {
    const { nomenclatureStore } = useMobxStores();

    const columns: TableColumnsType<NomenclatureItem> = [
        {
            title: "Заголовок",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            showSorterTooltip: false
        },
        {
            title: "Действия",
            width: "20%",
            render: (_, record: NomenclatureItem) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Редактировать категорию">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => nomenclatureStore.setSelectedCategory(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить категорию">
                        <Popconfirm
                            title="Это действие нельзя отменить. После удаления категории, курсы, связанные с ней, останутся без категории."
                            onConfirm={() => nomenclatureStore.deleteCategory(record.id)}
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

    useEffect(() => {
        nomenclatureStore.getCategories();
    }, []);

    return (
        <PageContainerControlPanel>
            <CreateCategoryModal
                openModal={nomenclatureStore.createCategoryModal}
                setOpenModal={nomenclatureStore.setCreateCategoryModal}
                handleSubmit={nomenclatureStore.createCategory}
            />

            <ChangeCategoryModal
                openModal={nomenclatureStore.changeCategoryModal}
                setOpenModal={nomenclatureStore.setChangeCategoryModal}
                handleSubmit={nomenclatureStore.changeCategory}
                initialValue={nomenclatureStore.selectedCategory}
            />

            <PageHeader
                title="Доступные категории"
                buttonTitle="Добавить категорию"
                onClickButton={() => nomenclatureStore.setCreateCategoryModal(true)}
                showBottomDivider
            />
            <Table
                rowKey={(record) => record.id}
                dataSource={nomenclatureStore.categories}
                columns={columns}
                loading={nomenclatureStore.loadingCategories}
                locale={{
                    emptyText: (
                        <Empty
                            description="Нет категорий"
                            imageStyle={{ height: 60 }}
                        />
                    ),
                }}
            />
        </PageContainerControlPanel>
    );
}

export default observer(CategoryPage);
