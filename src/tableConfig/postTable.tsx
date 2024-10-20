import { Button, Empty } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

interface postTableProps {
    setShowModal: (value: boolean) => void;
}

export const postTable = ({ setShowModal }: postTableProps) => ({
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст">
        <Button
            className="flex items-center justify-center transition-transform transform hover:scale-105"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setShowModal(true)}
        >
            Добавить пост
        </Button>
    </Empty>
})

export const paginationCount = 10;