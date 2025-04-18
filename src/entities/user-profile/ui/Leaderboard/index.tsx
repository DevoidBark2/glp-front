import React from "react";
import { observer } from "mobx-react";
import {Table, TableColumnsType, Tag} from "antd";
import Link from "next/link";

import { useMobxStores } from "@/shared/store/RootStore";
import { UserLevel } from "@/shared/api/users-level/model";


// Функция для получения цвета уровня
const getLevelColor = (level: string) => {
    switch (level) {
        case "Beginner":
            return "red";
        case "Novice":
            return "orange";
        case "Learner":
            return "yellow";
        case "Skilled":
            return "green";
        case "Advanced":
            return "cyan";
        case "Expert":
            return "blue";
        case "Master":
            return "indigo";
        case "Grandmaster":
            return "purple";
        case "Legend":
            return "pink";
        case "Immortal":
            return "black";
        default:
            return "gray";
    }
};

export const Leaderboard = observer(() => {
    const { userLevelStore } = useMobxStores();

    const columns: TableColumnsType<UserLevel> = [
        {
            title: '#',
            render: (text: any, record: any, index: number) => index + 1,
            align: 'center',
            width: '10%',
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record) => (
                <div className="flex items-center space-x-2">
                    <Link href={`/platform/users/${record.user.id}`}>
                        <span className="text-lg font-semibold">
                        {`${record.user.second_name ?? ''} ${record.user.first_name ?? ''} ${record.user.last_name ?? ''}`}
                    </span>
                    </Link>
                    <Tag color={getLevelColor(record.level)} className="rounded-full px-3 py-1 text-sm">
                        {record.level}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Баллы',
            dataIndex: 'points',
            key: 'points',
            align: 'right',
            render: (points: number) => (
                <span className="text-lg font-medium">{points}</span>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">🏆 Лидерборд</h2>
            <Table
                columns={columns}
                dataSource={userLevelStore.leaderBordUsers}
                pagination={false}
                rowHoverable={false}
                rowClassName={(record, index) =>
                    index === 0 ? 'bg-yellow-500': ''
                }
            />
        </div>
    );
});
