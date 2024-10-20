import { NomenclatureItem } from "@/stores/NomenclatureStore";
import { Button, Popconfirm, TableColumnsType, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface getCategoryColumnsProps {
    deleteCategory: (id: number) => void;
    setEditCategoryModal: (record: NomenclatureItem) => void;
}

export const getCategoryColumns = ({
    deleteCategory,
    setEditCategoryModal
}: getCategoryColumnsProps): TableColumnsType<NomenclatureItem> => [
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
                            onClick={() => setEditCategoryModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить категорию">
                        <Popconfirm
                            title="Это действие нельзя отменить. После удаления категории, курсы, связанные с ней, останутся без категории."
                            onConfirm={() => deleteCategory(record.id)}
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
