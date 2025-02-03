
import { StatusUserEnum } from "@/shared/api/user/model";
import {Tag} from "antd";
import React from "react";

export const showUserStatus = (userStatus: StatusUserEnum) => {
    switch (userStatus) {
        case StatusUserEnum.ACTIVATED:
            return (<Tag color='#4CAF50'>
                <span style={{display: 'flex', alignItems: 'center'}}>
    <span
        style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'green',
            marginRight: '8px',
        }}
    />
    Активный
    </span>
            </Tag>);
        case StatusUserEnum.DEACTIVATED:
            return (<Tag color="#A9A9A9">
        <span style={{display: 'flex', alignItems: 'center'}}>
    <span
        style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'gray',
            marginRight: '8px',
        }}
    />
    Не активный
    </span>
            </Tag>);
        case StatusUserEnum.DELETED:
            return (<Tag color="#8B0000">
        <span style={{display: 'flex', alignItems: 'center'}}>
    <span
        style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'red',
            marginRight: '8px',
        }}
    />
    Удален
    </span>
            </Tag>);
        case StatusUserEnum.BLOCKED:
            return (<Tag color="orange">
        <span style={{display: 'flex', alignItems: 'center'}}>
    <span
        style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'orange',
            marginRight: '8px',
        }}
    />
            Заблокирован
    </span>
            </Tag>);
    }
}