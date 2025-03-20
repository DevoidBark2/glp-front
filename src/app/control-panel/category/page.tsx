"use client"
import { observer } from "mobx-react";
import { Button, Empty, Popconfirm, Table, TableColumnsType, Tooltip } from "antd";
import React, {useEffect, useState} from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import {PageHeader} from "@/shared/ui/PageHeader";
import {PageContainerControlPanel} from "@/shared/ui";
import {CreateCategoryModal} from "@/entities/category/ui/CreateCategoryModal";
import {ChangeCategoryModal} from "@/entities/category/ui/ChangeCategoryModal";
import { NomenclatureItem } from "@/shared/api/nomenclature/model";
import {SettingControlPanel} from "@/shared/model";
import {useMobxStores} from "@/shared/store/RootStore";

const CategoryPage = () => {
    const { nomenclatureStore } = useMobxStores();
    const [settings, setSettings] = useState<SettingControlPanel | null>(null);

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
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
        nomenclatureStore.getCategories();
    }, [nomenclatureStore]);

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
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
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
