import { FILTER_STATUS_POST, FORMAT_VIEW_DATE, MAIN_COLOR } from "@/constants";
import { PostStatusEnum } from "@/enums/PostStatusEnum";
import { UserRole } from "@/enums/UserRoleEnum";
import { Post } from "@/stores/PostStore";
import { Button, Popconfirm, Popover, Switch, TableColumnsType, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import {
    CrownOutlined,
    DeleteOutlined,
    EditOutlined,
    UploadOutlined,
    UserOutlined
} from "@ant-design/icons";
import { UserHoverCard } from "@/components/PostPage/UserHoverCard";

interface getPostColumnsProps {
    getStatusTag: (status: PostStatusEnum, rejectReason?: string[]) => React.ReactNode;
    currentUser: any,
    renderTooltipTitle: (post: Post) => string
    publishPost: (postId: number, checked: boolean) => void
    submitReview: (postId: number) => void
    deletePost: (postId: number) => void
    handleChangePost: (post:Post) => void;
}



export const getPostColumns = ({getStatusTag,currentUser,renderTooltipTitle,publishPost,submitReview,deletePost,handleChangePost}: getPostColumnsProps): TableColumnsType<Post> => {
    
    const disabledRow = (record: Post) => {
        if (currentUser?.user.role === UserRole.TEACHER) {
            return false;
        } 
    
        if (currentUser?.user.role === UserRole.SUPER_ADMIN) {
            if (record.status !== PostStatusEnum.APPROVED && record.user.id !== currentUser.user.id) {
                return true;
            }
        }
        return false;
    }
    return [
        {
            title: 'Название',
            dataIndex: 'name',
            width: '20%',
            render: (text) => (
                <Tooltip title={text}>
                    <span className="dark:text-white">{text}</span>
                </Tooltip>
            ),
        },
        {
            dataIndex: 'created_at',
            width: '20%',
            title: 'Дата публикации',
            showSorterTooltip: false,
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (value) => <p className="dark:text-white">{dayjs(value).format(FORMAT_VIEW_DATE)}</p>
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: FILTER_STATUS_POST,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (_, record) => getStatusTag(record.status, record.rejectReason),
        },
        {
            title: "Опубликован",
            dataIndex: "is_publish",
            render: (_, record) => (
                <Tooltip
                    title={currentUser?.user.role !== UserRole.SUPER_ADMIN && renderTooltipTitle(record)}
                >
                    <Switch 
                        disabled={disabledRow(record)} 
                        checked={record.is_publish} 
                        onChange={(checked) => publishPost(record.id,checked)} 
                    />
                </Tooltip>
            ),
        },
        {
            title: "Создатель",
            dataIndex: "user",
            hidden: currentUser?.user.role !== UserRole.SUPER_ADMIN,
            render: (_, record) => (
                record.user.role === UserRole.SUPER_ADMIN ?
                    <div> <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                        <Tooltip title="Перейти в профиль">
                            <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                                Администратор
                            </Tag>
                        </Tooltip>
                    </Link>
                    </div> : <div>
                        <Popover
                            content={<UserHoverCard user={record.user} />}
                            title="Краткая информация"
                            trigger="hover"
                        >
                            <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
    
                            {record.user.role === UserRole.SUPER_ADMIN ? (
                                <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                                    <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                                        Super Admin
                                    </Tag>
                                </Link>
                            ) : (
                                <Link href={`/control-panel/users/${record.user.id}`} className="hover:text-blue-500">
                                    {`${record.user.second_name} ${record.user.first_name} ${record.user.last_name}`}
                                </Link>
                            )}
                        </Popover>
                    </div>
            ),
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    {(record.status === PostStatusEnum.NEW && currentUser?.user.role !== UserRole.SUPER_ADMIN) && (
                        <Tooltip title="Отправить на проверку">
                            <Button
                                type="default"
                                icon={<UploadOutlined />}
                                onClick={() => submitReview(record.id)}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Редактировать пост">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            disabled={disabledRow(record)}
                            onClick={() => handleChangePost(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить пост">
                        <Popconfirm
                            title="Удалить пост?"
                            description="Вы уверены, что хотите удалить этот пост? Это действие нельзя будет отменить."
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => deletePost(record.id)}
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
}