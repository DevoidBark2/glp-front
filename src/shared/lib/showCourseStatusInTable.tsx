import {Tag} from "antd";
import React from "react";

import { StatusCourseEnum } from "@/shared/api/course/model";

export const showCourseStatus = (status: StatusCourseEnum) => {
    switch (status) {
        case StatusCourseEnum.NEW:
            return (<Tag color="green">
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
    Новый
    </span>
                </Tag>);
        case StatusCourseEnum.ACTIVE:
            return (<Tag color="blue">
        <span style={{display: 'flex', alignItems: 'center'}}>
    <span
        style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'blue',
            marginRight: '8px',
        }}
    />
    Активный
    </span>
                </Tag>);
        case StatusCourseEnum.CLOSED:
            return (<Tag color="gray">
        <span style={{display: 'flex', alignItems: 'center'}}>
    <span
        style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'black',
            marginRight: '8px',
        }}
    />
    Закрытый
    </span>
                </Tag>);
        case StatusCourseEnum.IN_PROCESSING:
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
    В обработке
    </span>
                </Tag>);
        case StatusCourseEnum.REJECTED:
            return (<Tag color="red">
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
    Отклонен
    </span>
            </Tag>);
    }
};