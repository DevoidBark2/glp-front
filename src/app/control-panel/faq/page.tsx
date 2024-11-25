"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Form, Input, Table, Popconfirm, TableColumnsType, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { Faq } from "@/shared/api/faq/model";
import { useMobxStores } from "@/shared/store/RootStore";
import PageHeader from "@/components/PageHeader/PageHeader";
import { faqTable } from "@/shared/config/tableConfig";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { FaqControlList, FaqModal } from "@/entities/faq";

const FaqPage = () => {
    const { faqStore } = useMobxStores();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Faq | null>(null);
    const [form] = Form.useForm<Faq>();
    const [settings, setSettings] = useState<{
        pagination_size: number,
        table_size: SizeType,
        show_footer_table: boolean
    } | null>(null);

    const openModal = (record?: Faq) => {
        if (record) {
            setEditingItem(record);
        }
        setIsModalOpen(true);
        form.setFieldsValue(record || { question: "", answer: "" });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleAddOrUpdate = (values: Faq) => {
        if (editingItem)
            faqStore.updatedFaq(values);
        else faqStore.create(values);
        closeModal();
    };



    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
        faqStore.getAll();
    }, [])

    return (
        <PageContainerControlPanel>
            <FaqModal openModal={openModal}/>
            <PageHeader
                title="Вопросы и ответы"
                buttonTitle="Добавить FAQ"
                onClickButton={openModal}
                showBottomDivider
            />
            <FaqControlList/>
        </PageContainerControlPanel>
    );
};

export default observer(FaqPage);
