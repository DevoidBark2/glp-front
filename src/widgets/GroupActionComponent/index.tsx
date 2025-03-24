import {Button, Input, Select, Space} from "antd";
import React from "react";

import { StatusUserEnum } from "@/shared/api/user/model";

export interface GroupActionComponentProps {
    searchText: string;
    setSearchText: (value: string) => void,
    selectedAction?: StatusUserEnum | null;
    setSelectedAction?: (value: StatusUserEnum) => void,
    submitSelectedAction?: () => Promise<void>,
}

export const GroupActionComponent: React.FC<GroupActionComponentProps>= ({searchText,setSearchText,selectedAction,setSelectedAction,submitSelectedAction}) => <div>
        <Space style={{marginBottom: 16}}>
            <Input
                placeholder="Поиск по имени или email"
                value={searchText}
                allowClear={true}
                width="200px"
                onChange={(e) => setSearchText(e.target.value)}
            />
            {selectedAction && <>
                <Select
                placeholder="Групповые действия"
                style={{width: 200}}
                onChange={(value) => setSelectedAction!(value)}
            >
                <Select.Option value={StatusUserEnum.ACTIVATED}>Активировать</Select.Option>
                <Select.Option value={StatusUserEnum.DEACTIVATED}>Деактивировать</Select.Option>
                <Select.Option value={StatusUserEnum.BLOCKED}>Заблокировать</Select.Option>
            </Select>
            <Button
                type="primary"
                onClick={() => submitSelectedAction!()}
            >
                Применить
            </Button>
            </>}
        </Space>
    </div>