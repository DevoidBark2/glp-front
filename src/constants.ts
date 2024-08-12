import {StatusCourseEnum} from "@/enums/StatusCourseEnum";

export const FILTER_STATUS_COURSE = [
    {id: 1, text: 'Закрытый', value: StatusCourseEnum.CLOSED},
    {id: 1, text: 'Активный', value: StatusCourseEnum.ACTIVE},
    {id: 1, text: 'Новый', value: StatusCourseEnum.NEW},
    {id: 1, text: 'В обработке', value: StatusCourseEnum.IN_PROCESSING},
]

export const LEVEL_COURSE = [
    {id:1, title: 'Начинающий'},
    {id:2, title: 'Средний'},
    {id:3, title: 'Высокий'},
]