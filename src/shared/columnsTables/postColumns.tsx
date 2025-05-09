import React from "react";
import { Button, Popconfirm, Popover, Switch, TableColumnsType, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import {
    CrownOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined
} from "@ant-design/icons";

import { UserRole } from "@/shared/api/user/model";
import { ModeratorFeedback, Post, PostStatusEnum } from "@/shared/api/posts/model";
import { UserHoverCard } from "@/widgets";
import { FILTER_STATUS_POST, FORMAT_VIEW_DATE, MAIN_COLOR } from "@/shared/constants";
import { UserProfile } from "@/entities/user-profile/model/UserProfileStore";

interface getPostColumnsProps {
    getStatusTag: (status: PostStatusEnum, rejectReason?: ModeratorFeedback) => React.JSX.Element;
    currentUser: UserProfile | null,
    publishPost: (postId: number, checked: boolean) => void
    deletePost: (postId: number) => void
    handleChangePost: (postId: number) => void;
}



export const getPostColumns = ({ getStatusTag, currentUser, publishPost, deletePost, handleChangePost }: getPostColumnsProps): TableColumnsType<Post> => [
        {
            title: 'Название',
            dataIndex: 'name',
            width: '20%',
            render: (text) => (
                <Tooltip title={text.length > 30 ? text : ''}>
                    <span className="truncate" style={{ maxWidth: 'calc(30ch)' }}>
                        {text.length > 30 ? text.substring(0, 30) + '...' : text}
                    </span>
                </Tooltip>
            ),
        },
        {
            dataIndex: 'created_at',
            width: '20%',
            title: 'Дата публикации',
            showSorterTooltip: false,
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (value) => <p className="">{dayjs(value).format(FORMAT_VIEW_DATE)}</p>
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: FILTER_STATUS_POST,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (_, record) => getStatusTag(record.status, record.moderatorFeedBack),
        },
        {
            title: "Опубликован",
            dataIndex: "is_publish",
            render: (_, record) => 
                // const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;
                // const isUnderReview = record.status !== PostStatusEnum.APPROVED;
                // const isDisabled =
                //     (isSuperAdmin && isUnderReview) ||
                //     (!isSuperAdmin && record.status !== PostStatusEnum.APPROVED);

                 (
                    <Tooltip
                        // title={
                        //     isDisabled
                        //         ? isSuperAdmin && isUnderReview
                        //             ? "Кнопка недоступна, так как запись находится в проверке"
                        //             : "Кнопка доступна только для подтвержденных записей"
                        //         : undefined
                        // }
                        title={record.is_publish ? "Снять с публикации" : "Опубликовать пост"}
                    >
                        <Switch
                            // disabled={isDisabled}
                            checked={record.is_publish}
                            onChange={(checked) => publishPost(record.id, checked)}
                        />
                    </Tooltip>
                )
            ,
        },
        {
            title: "Создатель",
            dataIndex: "user",
            hidden: currentUser?.role !== UserRole.SUPER_ADMIN,
            render: (_, record) => record.user.role === UserRole.SUPER_ADMIN ? (
                    <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                        <Tooltip title="Перейти в профиль">
                            <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                                Администратор
                            </Tag>
                        </Tooltip>
                    </Link>
                ) : (
                    <Popover content={<UserHoverCard user={record.user} />} title="Краткая информация" trigger="hover">
                        <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
                        <Link href={`/control-panel/users/${record.user.id}`} className="hover:text-blue-500">
                            {`${record.user.second_name ?? ''} ${record.user.first_name ?? ''} ${record.user.last_name ?? ''}`}
                        </Link>
                    </Popover>
                ),
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    {/* {(currentUser && currentUser.role !== UserRole.SUPER_ADMIN) && <Tooltip title="Отправить на проверку">
                        <Button
                            type="default"
                            disabled={record.status === PostStatusEnum.IN_PROCESSING || record.status === PostStatusEnum.APPROVED}
                            icon={<UploadOutlined />}
                            onClick={() => submitReview(record.id)}
                        />
                    </Tooltip>} */}

                    <Tooltip title="Редактировать пост">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            // disabled={record.user.role !== UserRole.SUPER_ADMIN && record.status === PostStatusEnum.IN_PROCESSING}
                            onClick={() => handleChangePost(record.id)}
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
                            // disabled={record.user.role !== UserRole.SUPER_ADMIN && record.status === PostStatusEnum.IN_PROCESSING}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];
