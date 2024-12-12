"use client"
import { Table } from "antd";
import { useRouter } from "next/navigation";
import {PageHeader} from "@/shared/ui/PageHeader";
import {PageContainerControlPanel} from "@/shared/ui";

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