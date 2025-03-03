"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Table, TableColumnsType, Tag } from "antd";
import { UserLevel } from "@/shared/api/users-level/model";
import Link from "next/link";
import { UserLevelEnum } from "@/entities/user-profile";

const getLevelColor = (level: UserLevelEnum) => {
    const colors = {
        Beginner: "red",
        Novice: "orange",
        Learner: "yellow",
        Skilled: "green",
        Advanced: "cyan",
        Expert: "blue",
        Master: "indigo",
        Grandmaster: "purple",
        Legend: "pink",
        Immortal: "black",
    };
    return colors[level] || "gray";
};

const LeaderboardPage = observer(() => {
    const { userLevelStore } = useMobxStores();

    const columns: TableColumnsType<UserLevel> = [
        {
            title: "#",
            dataIndex: "rank",
            key: "rank",
            render: (text, record, index) => (
                <span className={`text-lg font-medium ${index === 0 ? "text-yellow-500" : "text-gray-600"}`}>
                    {index + 1}
                </span>
            ),
            align: "center",
            width: "10%",
        },
        {
            title: "Имя",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link href={`/platform/users/${record.user.id}`}>
                    <span className="text-base font-medium text-gray-800 hover:underline">
                        {`${record.user.second_name ?? ""} ${record.user.first_name ?? ""} ${record.user.last_name ?? ""}`}
                    </span>
                </Link>
            ),
        },
        {
            title: "Уровень",
            dataIndex: "level",
            key: "level",
            align: "center",
            render: (level) => (
                <Tag color={getLevelColor(level)} className="rounded-full px-3 py-1 text-xs font-semibold">
                    {level}
                </Tag>
            ),
            width: "15%",
        },
        {
            title: "Баллы",
            dataIndex: "points",
            key: "points",
            align: "right",
            render: (points) => (
                <span className="text-lg font-semibold text-gray-700">{points}</span>
            ),
        },
    ];

    useEffect(() => {
        userLevelStore.getAllUsersLevel();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🏆 Лидерборд</h2>
            <Table
                loading={userLevelStore.loading}
                columns={columns}
                dataSource={userLevelStore.leaderBordUsers}
                pagination={false}
                className="border rounded-xl shadow-md overflow-hidden"
            />
        </div>
    );
});

export default LeaderboardPage;
