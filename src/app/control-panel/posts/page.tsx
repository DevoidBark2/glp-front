"use client";
import {
    Table,
    Tag,
    Tooltip,
} from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { ModeratorFeedback, Post } from "@/stores/PostStore";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons";

import {PageHeader} from "@/shared/ui/PageHeader";
import { getPostColumns } from "@/columnsTables/postColumns";
import {PageContainerControlPanel} from "@/shared/ui";
import { postTable } from "@/shared/config";
import { PostStatusEnum } from "@/shared/api/posts/model";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useRouter } from "next/navigation";
import {useMobxStores} from "@/stores/stores";

const PostPage = () => {
    const { postStore, userProfileStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();

    const fieldNames: { [key: string]: string } = {
        name: "Заголовок",
        description: "Описание",
        content: "Содержание",
    };

    const getStatusTag = (status: PostStatusEnum, rejectReason?: ModeratorFeedback) => {
        switch (status) {
            case PostStatusEnum.NEW:
                return (
                    <Tooltip title="Новый">
                        <Tag icon={<ClockCircleOutlined />} color="blue">
                            Новый
                        </Tag>
                    </Tooltip>
                );
            case PostStatusEnum.IN_PROCESSING:
                return (
                    <Tooltip title="В обработке">
                        <Tag icon={<SyncOutlined spin />} color="yellow">
                            В обработке
                        </Tag>
                    </Tooltip>
                );

            case PostStatusEnum.MODIFIED:
                return (
                    <Tooltip title="Изменен">
                        <Tag icon={<ClockCircleOutlined />} color="gray">
                            Изменен
                        </Tag>
                    </Tooltip>
                );
            case PostStatusEnum.REJECT:
                return (
                    <Tooltip
                        title={
                            rejectReason?.comments &&
                            Object.entries(rejectReason.comments).map(([field, message], index) => (
                                <div key={index}>
                                    <strong>{fieldNames[field] || field}:</strong> {message}
                                </div>
                            ))
                        }
                        color="red"
                    >
                        <Tag color="red">Отклонен</Tag>
                    </Tooltip>
                );
            case PostStatusEnum.APPROVED:
                return (
                    <Tooltip title="Подтвержден">
                        <Tag icon={<CheckCircleOutlined />} color="green">
                            Подтвержден
                        </Tag>
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip title="Неизвестный статус">
                        <Tag color="gray">Неизвестный</Tag>
                    </Tooltip>
                );
        }
    };

    const renderTooltipTitle = (record: Post) => {
        switch (record.status) {
            case PostStatusEnum.NEW:
                return "Отправьте сначала на проверку и ожидайте ответа от модератора перед публикацией поста.";
            case PostStatusEnum.MODIFIED:
                return "Отправьте сначала на проверку и ожидайте ответа от модератора перед публикацией поста.";
            case PostStatusEnum.IN_PROCESSING:
                return "Ожидайте подтверждения модератором."
            case PostStatusEnum.REJECT:
                return "Пост был отклонен модератором,больше информации находится в форме редактирования поста."
            case PostStatusEnum.APPROVED:
                return "Пост успешно прошел проверку, Вы можете опубликовать данный пост."
            default:
                return "Неизвестно"
        }
    }

    const handelChangePost = (postId: number) => {
        router.push(`posts/${postId}`)
    }

    const [settings, setSettings] = useState<{
        pagination_size: number,
        table_size: SizeType,
        show_footer_table: boolean
    } | null>(null);


    useEffect(() => {
        userProfileStore.getUserProfile().then(response => {
            setCurrentUser(response)
        })
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
        postStore.getUserPosts();
    }, []);

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Доступные посты"
                buttonTitle="Добавить пост"
                onClickButton={() => router.push('posts/add')}
                showBottomDivider
            />
            <Table
                rowKey={(record) => record.id}
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                loading={postStore.loading}
                dataSource={postStore.userPosts}
                columns={getPostColumns({
                    getStatusTag: getStatusTag,
                    currentUser: currentUser,
                    renderTooltipTitle: renderTooltipTitle,
                    publishPost: postStore.publishPost,
                    submitReview: postStore.submitReview,
                    deletePost: postStore.deletePost,
                    handleChangePost: handelChangePost
                })}
                locale={postTable()}
            />
        </PageContainerControlPanel>
    );
}

export default observer(PostPage);
