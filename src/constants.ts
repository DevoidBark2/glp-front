import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
import {ActionEvent} from "@/enums/ActionEventUser";

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
export const eventColors = {
    [ActionEvent.CREATE_COURSE]: "green",
    [ActionEvent.UPDATE_COURSE]: "blue",
    [ActionEvent.DELETE_COURSE]: "red",
    [ActionEvent.PUBLISH_COURSE]: "gold",
    [ActionEvent.UNPUBLISH_COURSE]: "orange",

    [ActionEvent.ENROLL_STUDENT]: "purple",
    [ActionEvent.UNENROLL_STUDENT]: "magenta",

    [ActionEvent.CREATE_LESSON]: "cyan",
    [ActionEvent.UPDATE_LESSON]: "geekblue",
    [ActionEvent.DELETE_LESSON]: "volcano",

    [ActionEvent.ADD_COMMENT]: "lime",
    [ActionEvent.DELETE_COMMENT]: "pink",
    [ActionEvent.UPDATE_COMMENT]: "yellow",

    [ActionEvent.LOGIN]: "blue",
    [ActionEvent.LOGOUT]: "grey",

    [ActionEvent.PASSWORD_RESET]: "purple",
    [ActionEvent.UPDATE_PROFILE]: "orange",

    [ActionEvent.ADD_TEACHER]: "green",
    [ActionEvent.REMOVE_TEACHER]: "red",
    [ActionEvent.UPDATE_TEACHER]: "blue",

    [ActionEvent.CREATE_CATEGORY]: "cyan",
    [ActionEvent.UPDATE_CATEGORY]: "blue",
    [ActionEvent.DELETE_CATEGORY]: "red",
};

export const eventTooltips = {
    [ActionEvent.CREATE_COURSE]: "Создание нового курса",
    [ActionEvent.UPDATE_COURSE]: "Обновление существующего курса",
    [ActionEvent.DELETE_COURSE]: "Удаление курса",
    [ActionEvent.PUBLISH_COURSE]: "Публикация курса",
    [ActionEvent.UNPUBLISH_COURSE]: "Снятие курса с публикации",

    [ActionEvent.ENROLL_STUDENT]: "Запись студента на курс",
    [ActionEvent.UNENROLL_STUDENT]: "Удаление студента с курса",

    [ActionEvent.CREATE_LESSON]: "Создание нового урока",
    [ActionEvent.UPDATE_LESSON]: "Обновление урока",
    [ActionEvent.DELETE_LESSON]: "Удаление урока",

    [ActionEvent.ADD_COMMENT]: "Добавление комментария",
    [ActionEvent.DELETE_COMMENT]: "Удаление комментария",
    [ActionEvent.UPDATE_COMMENT]: "Обновление комментария",

    [ActionEvent.LOGIN]: "Вход пользователя",
    [ActionEvent.LOGOUT]: "Выход пользователя",

    [ActionEvent.PASSWORD_RESET]: "Сброс пароля",
    [ActionEvent.UPDATE_PROFILE]: "Обновление профиля пользователя",

    [ActionEvent.ADD_TEACHER]: "Добавление учителя",
    [ActionEvent.REMOVE_TEACHER]: "Удаление учителя",
    [ActionEvent.UPDATE_TEACHER]: "Обновление данных учителя",

    [ActionEvent.CREATE_CATEGORY]: "Создание новой категории курса",
    [ActionEvent.UPDATE_CATEGORY]: "Обновление категории курса",
    [ActionEvent.DELETE_CATEGORY]: "Удаление категории курса",
};