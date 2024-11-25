import { Faq } from "@/shared/api/faq/model";
import { Button, Popconfirm, Table, TableColumnsType, Tooltip } from "antd";
import { observer } from "mobx-react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useMobxStores } from "@/shared/store/RootStore";
import { faqTable } from "@/shared/config/tableConfig";

export const FaqControlList = observer(() => {
    const { faqStore } = useMobxStores();
    const [settings, setSettings] = useState<{
        pagination_size: number,
        table_size: SizeType,
        show_footer_table: boolean
    } | null>(null);
    
    const columns: TableColumnsType<Faq> = [
        {
            title: "Вопрос",
            dataIndex: "question",
            key: "question",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Ответ",
            dataIndex: "answer",
            key: "answer",
            render: (text) => {
                const maxLength = 50;
                return text.length > maxLength
                    ? `${text.substring(0, maxLength)}...`
                    : text;
            }
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Редактировать">
                        <Button type="default" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Popconfirm
                            title="Удалить этот вопрос?"
                            onConfirm={() => faqStore.delete(record.id)}
                            placement="leftBottom"
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button danger type="primary" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
    },[])

    return (
        <Table
            size={(settings && settings.table_size) ?? "middle"}
            footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
            pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
            rowKey={(record) => record.id}
            loading={faqStore.loading}
            dataSource={faqStore.faqs}
            columns={columns}
            expandable={{
                expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.answer}</p>,
            }}
            locale={faqTable}
        />
    )
})