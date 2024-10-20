import { FILTER_STATUS_AVATAR_ICONS, FORMAT_VIEW_DATE } from "@/constants";
import { AvatarIcon } from "@/stores/AvatarIconsStore"
import {
    Button, Popconfirm,
    Tooltip,
    Image,
    TableColumnsType,
    Switch
} from "antd"
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import nextConfig from "next.config.mjs";
import { StatusAvatarIconEnum } from "@/enums/StatusAvatarIconEnum";


interface avatarIconColumnsProps {
    handleDeleteAvatar: (id: number) => void;
}

export const avatarIconColumns = ({ handleDeleteAvatar }: avatarIconColumnsProps): TableColumnsType<AvatarIcon> => [
    {
        title: 'Иконка',
        dataIndex: 'image',
        width: '20%',
        render: (text) => (
            <Tooltip title="Изображение аватарки">
                <Image src={`${nextConfig.env?.API_URL}${text}`} width={50} height={50} alt="text" />
            </Tooltip>
        ),
    },
    {
        title: 'Дата публикации',
        dataIndex: 'created_at',
        width: '20%',
        showSorterTooltip: false,
        sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
        render: (value) => (
            <Tooltip title={`Дата создания: ${dayjs(value).format(FORMAT_VIEW_DATE)}`}>
                <p className="text-gray-600 dark:text-gray-300">
                    <i className="fas fa-calendar-alt"></i> {dayjs(value).format(FORMAT_VIEW_DATE)}
                </p>
            </Tooltip>
        ),
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        filters: FILTER_STATUS_AVATAR_ICONS,
        onFilter: (value, record) => record.status.startsWith(value as string),
        filterSearch: true,
        render: (status, record) => {
            const isActive = status === StatusAvatarIconEnum.ACTIVE;
            return (
                <Tooltip title={isActive ? 'Активный' : 'Не активный'}>
                    <Switch
                        checked={isActive}
                        onChange={(checked) => {
                            // Здесь вызов функции для изменения статуса на сервере
                            // Например, вызов метода updateStatus(record.id, checked ? 'active' : 'disabled');
                            console.log(`Изменение статуса для ${record.id} на ${checked ? 'active' : 'disabled'}`);
                        }}
                        checkedChildren="Активный"
                        unCheckedChildren="Не активный"
                    />
                </Tooltip>
            );
        },
    },
    {
        title: 'Действия',
        width: '20%',
        align: 'center',
        render: (_, record) => (
            <div className="flex justify-end gap-2">
                <Tooltip title="Удалить иконку">
                    <Popconfirm
                        title="Удаление иконки"
                        description="Удалить эту иконку? Если она используется пользователем, будет сброшена до стандартной. Действие нельзя отменить."
                        okText="Да"
                        onConfirm={() => handleDeleteAvatar(record.id)}
                        cancelText="Нет"
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
