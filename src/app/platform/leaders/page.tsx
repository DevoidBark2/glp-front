"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import {Avatar, Table, TableColumnsType, Tag} from "antd";
import Link from "next/link";
import {UserOutlined} from "@ant-design/icons";

import { useMobxStores } from "@/shared/store/RootStore";
import {UserLevel, UserLevelEnum} from "@/shared/api/users-level/model";
import {AuthMethodEnum} from "@/shared/api/auth/model";

import nextConfig from "../../../../next.config.mjs";


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
            fixed: 'left',
        },
        {
            title: "Имя",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <>
                    <Avatar
                        shape="square"
                        size={50}
                        src={
                            record.user?.profile_url
                                ? record.user?.method_auth === AuthMethodEnum.GOOGLE ||
                                record.user?.method_auth === AuthMethodEnum.YANDEX
                                    ? record.user?.profile_url
                                    : `${nextConfig.env?.API_URL}${record.user?.profile_url}`
                                : undefined
                        }
                        icon={!record.user?.profile_url && <UserOutlined />}
                    />
                    <Link href={`/platform/users/${record.user.id}`} className="ml-2">
                    <span className="text-base font-medium text-gray-800 hover:underline break-words">
                        {`${record.user.second_name ?? ""} ${record.user.first_name ?? ""} ${record.user.last_name ?? ""}`}
                    </span>
                    </Link>
                </>
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
    }, [userLevelStore]);

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold my-6 text-gray-800">🏆 Лидерборд</h2>
            <Table
                rowKey={(record) => record.id}
                loading={userLevelStore.loading}
                columns={columns}
                dataSource={userLevelStore.leaderBordUsers}
                pagination={false}
                className="border rounded-xl shadow-md overflow-hidden"
                scroll={{x: 400}}
            />
        </div>
    );
});

export default LeaderboardPage;
