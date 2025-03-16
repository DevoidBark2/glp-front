import {Tag} from "antd";
import React from "react";

import {CourseComponentType} from "@/shared/api/component/model";

export const renderType = (type: CourseComponentType) => {
    switch (type) {
        case CourseComponentType.Text:
            return <Tag color="cyan">Текст</Tag>;
        case CourseComponentType.Quiz:
            return <Tag color="green">Квиз</Tag>;
        case CourseComponentType.Coding:
            return <Tag color="purple">Программирование</Tag>;
        default:
            return <Tag color="default">Неизвестно</Tag>;
    }
};