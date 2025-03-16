import { FC } from "react";
import { Button, Typography } from "antd";
import Link from "next/link";

import { User } from "@/shared/api/user/model";

interface UserHoverCardProps {
    user: User
}

export const UserHoverCard: FC<UserHoverCardProps> = ({ user }) => (
    <div className="p-4">
        <Typography.Title level={5}>
            {`${user.second_name ?? ''} ${user.first_name ?? ''} ${user.last_name ?? ''}`}
        </Typography.Title>
        <Typography.Paragraph>
            <strong>Email:</strong> {user.email}
        </Typography.Paragraph>
        <Typography.Paragraph>
            <strong>Телефон:</strong> {user.phone}
        </Typography.Paragraph>
        <Link href={`/control-panel/users/${user.id}`}>
            <Button type="link" style={{ paddingLeft: 0 }}>
                Посмотреть профиль
            </Button>
        </Link>
    </div>
);