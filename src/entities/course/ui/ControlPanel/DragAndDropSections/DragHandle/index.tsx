import React, {useContext} from "react";
import {Button} from "antd";
import {HolderOutlined} from "@ant-design/icons";

import {RowContext} from "@/entities/course/ui";

export const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{ cursor: 'move' }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};