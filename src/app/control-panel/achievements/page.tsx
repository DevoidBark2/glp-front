"use client"
import { Button, Divider, Table } from "antd";
import {PlusCircleOutlined,MoreOutlined} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const AchievementsPage = () => {
    const router = useRouter()
    return (
        <>
            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-800 font-bold text-3xl mb-2">Доступные достижения</h1>
                    <div>
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            icon={<PlusCircleOutlined />}
                            type="primary"
                            onClick={() => router.push('achievements/add')}
                        >
                            Добавить достижение
                        </Button>
                        <Button className="ml-2" icon={<MoreOutlined />} />
                    </div>
                </div>
                <Divider />
                <Table
                    // rowKey={(record) => record.id}
                    // dataSource={avatarIconsStore.avatarIcons}
                    // columns={columns}
                />
            </div>
        </>
    )
}

export default AchievementsPage;