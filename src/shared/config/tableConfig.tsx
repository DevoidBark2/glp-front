import { Empty } from "antd";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

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



export const postTable = () => ({
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить фильтр",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст">
        <Link href="posts/add">
            <Button
                className="flex items-center justify-center transition-transform transform hover:scale-105"
                type="primary"
                icon={<PlusCircleOutlined />}
            >
                Добавить пост
            </Button>
        </Link>
    </Empty>
})

export const usersTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить",
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
    filterReset: "Сбросить",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}

export const sectionsTable = {
    filterEmptyText: "Список пуст",
    filterReset: "Сбросить",
    filterConfirm: "Применить",
    filterSearchPlaceholder: "Поиск...",
    emptyText: <Empty description="Список пуст" />
}