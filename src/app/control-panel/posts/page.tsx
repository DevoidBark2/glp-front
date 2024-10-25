"use client";
import {
    Form,
    Table,
    Tag,
    Tooltip,
} from "antd";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useState } from "react";
import { Post } from "@/stores/PostStore";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { PostStatusEnum } from "@/enums/PostStatusEnum";

import PageHeader from "@/components/PageHeader/PageHeader";
import { postTable } from "@/tableConfig/postTable";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/enums/UserRoleEnum";
import { getPostColumns } from "@/columnsTables/postColumns";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { CreatePostModal } from "@/components/PostPage/CreatePostModal";
import { ChangePostModal } from "@/components/PostPage/ChangePostModal";

const PostPage = () => {
    const { postStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();
    const [changePostForm] = Form.useForm();
    const [changePostModal,setChagePostModal] = useState(false);

    const getStatusTag = (status: PostStatusEnum, rejectReason?: string[]) => {
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
            case PostStatusEnum.REJECT:
                return (
                    <Tooltip title={rejectReason?.map((reason, index) => (
                        <div key={index}>• {reason}</div>
                    ))} color="red">
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
                return "Отправьте сначала на проверку и ожидайте подтверждения перед публикацией поста.";
            case PostStatusEnum.IN_PROCESSING:
                return "Ожидайте подтверждения модератором."
            case PostStatusEnum.REJECT:
                return "Пост был отклонен модератором,больше информации находится в форме редактирования поста."
            case PostStatusEnum.APPROVED:
                return "Пост успешно прошел проверку, Вы можете опубликовать данные пост."
            default:
                return "Неизвестно"
        }
    }

    const handelChangePost = (post: Post) => {
        changePostForm.setFieldsValue(post);
        setChagePostModal(true);
    }


    useEffect(() => {
        const user = getCookieUserDetails();
        setCurrentUser(user);
        postStore.getUserPosts();
    }, []);

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Доступные посты"
                buttonTitle="Добавить пост"
                onClickButton={() => postStore.setCreatePostModal(true)}
                showBottomDivider
            />
            <Table
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
                rowKey={(record) => record.id}
                locale={postTable({ setShowModal: () => postStore.setCreatePostModal(true) })}
            />
            <CreatePostModal
                form={form}
                createPostModal={postStore.createPostModal}
                setCreatePostModal={postStore.setCreatePostModal}
                createPost={postStore.createPost}
                currentUser={currentUser}
                postLoading={postStore.loading}
            />

            <ChangePostModal
                form={changePostForm}
                createPostModal={changePostModal}
                setChangePostModal={setChagePostModal}
                changePost={postStore.changePost}
                currentUser={currentUser}
                postLoading={postStore.loading}
            />
        </PageContainerControlPanel>
    );
}

export default observer(PostPage);
