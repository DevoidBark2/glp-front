"use client"
import { Table } from "antd";
import React, { useEffect, useTransition } from "react";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import PageHeader from "@/components/PageHeader/PageHeader";
import CreateAvatarIconModal from "@/components/CreateAvatarIconModal/CreateAvatarIconModal";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { avatarIconColumns } from "@/columnsTables/avatarIconColumns";
import { avatarIconTable } from "@/shared/config/tableConfig";

const AvatarIconsPage = () => {
    const { avatarIconsStore } = useMobxStores();

    useEffect(() => {
        avatarIconsStore.getAllAvatarIcons();
    }, [])

    return (
        <>
            <CreateAvatarIconModal
                showModal={avatarIconsStore.showCreateModal}
                onCancelModal={() => avatarIconsStore.setShowCreateModal(false)}
                submitLoadingButton={avatarIconsStore.loadingAvatars}
                handleSubmitForm={avatarIconsStore.createAvatarIcon}
            />
            <PageContainerControlPanel>
                <PageHeader
                    title="Доступные иконки"
                    buttonTitle=" Добавить иконку"
                    onClickButton={() => avatarIconsStore.setShowCreateModal(true)}
                    showBottomDivider
                />
                <Table
                    rowKey={(record) => record.id}
                    dataSource={avatarIconsStore.avatarIcons}
                    columns={avatarIconColumns({ handleDeleteAvatar: avatarIconsStore.deleteAvatarIcon })}
                    locale={avatarIconTable}
                />
            </PageContainerControlPanel>
        </>
    );
}

export default observer(AvatarIconsPage)