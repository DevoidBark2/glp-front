import { Empty } from "antd";

export const avatarIconTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}

export const paginationCount = 10;

export const coursesTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}

import { Button } from "antd";
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

export const usersTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}

export const faqTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}

export const taskTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}

export const sectionsTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}