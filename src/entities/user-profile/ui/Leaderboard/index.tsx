import React from "react";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";
import {Table, TableColumnsType, Tag} from "antd";
import { UserLevel } from "@/shared/api/users-level/model";
import Link from "next/link";

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

    // Столбцы таблицы
    const columns: TableColumnsType<UserLevel> = [
        {
            title: '#',
            dataIndex: 'rank',
            key: 'rank',
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

    // Данные для таблицы
    const data = userLevelStore.leaderBordUsers.map((userLevel, index) => ({
        key: index,
        rank: index + 1,
        user: userLevel.user,
        level: userLevel.level,
        points: userLevel.points,
    }));

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">🏆 Лидерборд</h2>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowHoverable={false}
                rowClassName={(record, index) =>
                    index === 0 ? 'bg-yellow-500': ''
                }
            />
        </div>
    );
});
