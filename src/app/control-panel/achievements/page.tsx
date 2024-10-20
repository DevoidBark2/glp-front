"use client"
import { Table } from "antd";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader/PageHeader";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";

const AchievementsPage = () => {
    const router = useRouter()
    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Доступные достижения"
                buttonTitle="Добавить достижение"
                onClickButton={() => router.push('achievements/add')}
                showBottomDivider
            />
            <Table
            // rowKey={(record) => record.id}
            // dataSource={avatarIconsStore.avatarIcons}
            // columns={columns}
            />
        </PageContainerControlPanel>
    )
}

export default AchievementsPage;