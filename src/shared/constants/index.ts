import {CourseComponentType, StatusCourseComponentEnum} from "@/shared/api/component/model";
import {StatusCourseEnum} from "@/shared/api/course/model";

import { ActionEvent } from "../api/action-user";
import { PostStatusEnum } from "../api/posts/model";
import { StatusUserEnum, UserRole } from "../api/user/model";

export const MAIN_COLOR = "#00b96b"

export type PlatformMenu = {
    key: number;
    title: string;
    link: string;
    icon: any
}
export const FILTER_STATUS_POST = [
    { id: 1, text: 'Новый', value: PostStatusEnum.NEW },
    { id: 2, text: 'В обработке', value: PostStatusEnum.IN_PROCESSING },
    { id: 2, text: 'Подтвержден', value: PostStatusEnum.APPROVED },
    { id: 4, text: 'Отклонен', value: PostStatusEnum.REJECT },
]

export const FILTER_ROLE_USER = [
    { id: 1, text: 'Пользователь', value: UserRole.STUDENT },
    { id: 2, text: 'Модератор', value: UserRole.MODERATOR },
    { id: 3, text: 'Учитель', value: UserRole.TEACHER },
]

export const FILTER_TYPE_COMPONENT_COURSE = [
    { id: 1, text: 'Текст', value: CourseComponentType.Text },
    { id: 2, text: 'Квиз', value: CourseComponentType.Quiz },
    { id: 3, text: 'Множественный выбор', value: CourseComponentType.MultiPlayChoice },
    { id: 4, text: 'Простая задача', value: CourseComponentType.SimpleTask },
]

export const FILTER_STATUS_COMPONENT_COURSE = [
    { id: 1, text: 'Активен', value: StatusCourseComponentEnum.ACTIVATED },
    { id: 2, text: 'Неактивен', value: StatusCourseComponentEnum.DEACTIVATED },
]

export const FILTER_STATUS_USER = [
    { id: 1, text: 'Активен', value: StatusUserEnum.ACTIVATED },
    { id: 2, text: 'Неактивен', value: StatusUserEnum.DEACTIVATED },
    { id: 3, text: 'Удален', value: StatusUserEnum.DELETED },
    { id: 4, text: 'Заблокирован', value: StatusUserEnum.BLOCKED },
]

export const LEVEL_COURSE = [
    { id: 0, title: 'Начинающий' },
    { id: 1, title: 'Средний' },
    { id: 2, title: 'Высокий' },
]
export const userRoleColors = {
    [UserRole.STUDENT]: "blue",
    [UserRole.MODERATOR]: "orange",
    [UserRole.TEACHER]: "green",
    [UserRole.SUPER_ADMIN]: "black",
}
export const FILTER_STATUS_COURSE = [
    { id: 1, text: 'Закрытый', value: StatusCourseEnum.CLOSED },
    { id: 2, text: 'Активный', value: StatusCourseEnum.ACTIVE },
    { id: 3, text: 'Новый', value: StatusCourseEnum.NEW },
    { id: 4, text: 'В обработке', value: StatusCourseEnum.IN_PROCESSING },
    { id: 5, text: 'Отклонен', value: StatusCourseEnum.REJECTED },
]
export const statusCourses = {
    [StatusCourseEnum.ACTIVE]: "blue",
    [StatusCourseEnum.CLOSED]: "gray",
    [StatusCourseEnum.NEW]: "green",
    [StatusCourseEnum.IN_PROCESSING]: "yellow",
    [StatusCourseEnum.REJECTED]: "red",
}

export const statusCourseLabels = {
    [StatusCourseEnum.NEW]: 'Новый',
    [StatusCourseEnum.ACTIVE]: 'Активный',
    [StatusCourseEnum.CLOSED]: 'Закрытый',
    [StatusCourseEnum.IN_PROCESSING]: 'В обработке',
    [StatusCourseEnum.REJECTED]: 'Отклонен',
};

export const eventColors = {
    [ActionEvent.LOGIN]: "blue",
    [ActionEvent.LOGOUT]: "grey",
    [ActionEvent.CREATE_COURSE]: "green",
    [ActionEvent.DELETE_COURSE]: "red",
    [ActionEvent.PUBLISH_COURSE]: "gold",
    [ActionEvent.UNPUBLISH_COURSE]: "orange",
    [ActionEvent.ENROLL_STUDENT]: "purple",
    [ActionEvent.UNENROLL_STUDENT]: "magenta",
};


export const GeneralSettingTooltips = {
    PLATFORM_NAME: {
        LABEL: "Название платформы",
        PLACEHOLDER: "Введите название платформы"
    },
    SERVICE_MODE: {
        TOOLTIP: "Включите этот режим, чтобы поставить сайт на техническое обслуживание. В этом режиме пользователи будут видеть сообщение о том, что сайт временно недоступен.",
        LABEL: "Режим обслуживания",
    },
    PLATFORM_LOGO: {
        LABEL: "Логотип платформы",
        PLACEHOLDER: "Введите URL логотипа"
    },
    CACHE_ENABLED: {
        LABEL: "Настройки кэширования данных",
        PLACEHOLDER: "Выберите опцию"
    },
    AUTO_CONFIRM_REGISTER: {
        LABEL: "Автоматическое подтверждение регистрации",
        TOOLTIP: "Включение автоматического подтверждения регистрации: при регистрации нового пользователя, система автоматически отправит им подтверждение email, чтобы обеспечить безопасность и ускорить процесс регистрации"
    },
    USER_ROLE_DEFAULT: {
        LABEL: "Роль пользователя по умолчанию",
        PLACEHOLDER: "Выберите роль"
    },
    USER_COMPLAINT_NOTIFICATION: {
        TOOLTIP: "Включение уведомлений о новых жалобах пользователей: вы будете получать уведомления каждый раз, когда новый отзыв или жалоба поступает в систему",
        LABEL: "Уведомления о жалобах пользователей",
    },
    PERIOD_USER_OF_INACTIVITY: {
        LABEL: "Период неактивности до блокировки аккаунта, дней",
        PLACEHOLDER: "Введите кол-во дней"
    },
    AUTO_PUBLISH_COURSE: {
        LABEL: "Автоматическая публикация курсов",
        TOOLTIP: "Включите этот параметр, чтобы курсы автоматически публиковались после создания, без необходимости модерации и проверки"
    },
    MAX_UPLOAD_FILE_SIZE: {
        LABEL: "Максимальный размер файла для загрузки (МБ)",
        TOOLTIP: "Установите максимальный размер файла, который можно загрузить на платформу.",
        PLACEHOLDER: "Введите максимальный размер"
    },
    MODERATION_REVIEWS_COURSE: {
        LABEL: "Модерация отзывов на курсы",
        TOOLTIP: "Включите этот параметр, чтобы отзывы студентов проходили предварительную модерацию перед публикацией.",
    },
    MODERATION_COURSE: {
        LABEL: "Модерация новых курсов перед публикацией",
        TOOLTIP: "Включите этот параметр, чтобы новые курсы проходили модерацию перед тем, как стать доступными для студентов"
    },
    AUDIT_TRAIL: {
        LABEL: "Журнал аудита",
        TOOLTIP: " Включает ведение журнала аудита для отслеживания всех административных действий."
    },
    MIN_PASSWORD_LENGTH: {
        LABEL: "Минимальная длина пароля",
        TOOLTIP: "Устанавливает минимальную длину пароля для пользователей, чтобы повысить безопасность учетных записей.",
        PLACEHOLDER: "Минимальная длина пароля"
    },
    COMPLEXITY_PASSWORD: {
        LABEL: "Сложность пароля",
        TOOLTIP: "Настройка требований к сложности пароля, например, наличие символов, цифр и специальных символов.",
        PLACEHOLDER: "Выберите сложность пароля"
    }
}

export const FORMAT_VIEW_DATE = "YYYY-MM-DD HH:mm"

