import {Button, Input, Select, Space} from "antd";
import React from "react";
import {GroupActionComponentProps} from "@/interfaces/GroupActionComponentProps";
import {StatusUserEnum} from "@/enums/StatusUserEnum";

const GroupActionComponent: React.FC<GroupActionComponentProps>= ({loading,searchText,setSearchText,selectedAction,setSelectedAction,submitSelectedAction}) => {
    return <div>
        <Space style={{marginBottom: 16}}>
            <Input.Search
                placeholder="Поиск по имени или email"
                loading={loading}
                value={searchText}
                allowClear={true}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
                placeholder="Групповые действия"
                style={{width: 200}}
                onChange={(value) => setSelectedAction(value)}
            >
                <Select.Option value={StatusUserEnum.ACTIVATED}>Активировать</Select.Option>
                <Select.Option value={StatusUserEnum.DEACTIVATED}>Деактивировать</Select.Option>
                <Select.Option value={StatusUserEnum.BLOCKED}>Заблокировать</Select.Option>
            </Select>
            <Button
                type="primary"
                onClick={() => submitSelectedAction()}
            >
                Применить
            </Button>
        </Space>
    </div>
}

export default GroupActionComponent;