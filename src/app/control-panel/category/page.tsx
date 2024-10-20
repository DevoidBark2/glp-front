"use client"
import { observer } from "mobx-react";
import { Empty, Table } from "antd";
import React, { useEffect } from "react";
import { useMobxStores } from "@/stores/stores";
import PageHeader from "@/components/PageHeader/PageHeader";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { getCategoryColumns } from "@/columnsTables/categoryColumns";
import CreateCategoryModal from "@/components/CategoryPage/CategoryModals/CreateCategoryModal";
import ChangeCategoryModal from "@/components/CategoryPage/CategoryModals/ChangeCategoryModal";

const CategoryPage = () => {
    const { nomenclatureStore } = useMobxStores();

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
                handleSubmit={nomenclatureStore.handleChangeCategoryName}
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
                columns={getCategoryColumns({
                    deleteCategory: nomenclatureStore.deleteCategory,
                    setEditCategoryModal: nomenclatureStore.setSelectedCategory,
                })}
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
