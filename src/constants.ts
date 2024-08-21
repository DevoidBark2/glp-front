import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
import {ActionEvent} from "@/enums/ActionEventUser";
import {CourseComponentType} from "@/enums/CourseComponentType";
import {StatusComponentTaskEnum} from "@/enums/StatusComponentTaskEnum";
import {PostStatusEnum} from "@/enums/PostStatusEnum";
import {UserRole} from "@/enums/UserRoleEnum";
import {StatusUserEnum} from "@/enums/StatusUserEnum";

export const FILTER_STATUS_COURSE = [
    {id: 1, text: 'Закрытый', value: StatusCourseEnum.CLOSED},
    {id: 2, text: 'Активный', value: StatusCourseEnum.ACTIVE},
    {id: 3, text: 'Новый', value: StatusCourseEnum.NEW},
    {id: 4, text: 'В обработке', value: StatusCourseEnum.IN_PROCESSING},
]
export const FILTER_STATUS_POST = [
    {id: 1, text: 'Новый', value: PostStatusEnum.NEW},
    {id: 2, text: 'В обработке', value: PostStatusEnum.IN_PROCESSING},
    {id: 3, text: 'Активный', value: PostStatusEnum.ACTIVE},
    {id: 4, text: 'Отклонен', value: PostStatusEnum.REJECT},
]

export const FILTER_ROLE_USER = [
    {id: 1, text: 'Пользователь', value: UserRole.STUDENT},
    {id: 2, text: 'Модератор', value: UserRole.MODERATOR},
    {id: 3, text: 'Учитель', value: UserRole.TEACHER},
]

export const FILTER_TYPE_COMPONENT_COURSE = [
    {id: 1, text: 'Текст', value: CourseComponentType.Text},
    {id: 2, text: 'Квиз', value: CourseComponentType.Quiz},
]

export const FILTER_STATUS_COMPONENT_COURSE = [
    {id: 1, text: 'Активен', value: StatusComponentTaskEnum.ACTIVATED},
    {id: 2, text: 'Неактивен', value: StatusComponentTaskEnum.DEACTIVATED},
]

export const FILTER_STATUS_USER = [
    {id: 1, text: 'Активен', value: StatusUserEnum.ACTIVATED},
    {id: 2, text: 'Неактивен', value: StatusUserEnum.DEACTIVATED},
    {id: 3, text: 'Удален', value: StatusUserEnum.DELETED},
    {id: 4, text: 'Заблокирован', value: StatusUserEnum.BLOCKED},
]

export const LEVEL_COURSE = [
    {id: 1, title: 'Начинающий'},
    {id: 2, title: 'Средний'},
    {id: 3, title: 'Высокий'},
]
export const userRoleColors = {
    [UserRole.STUDENT] : "blue",
    [UserRole.MODERATOR] : "gray",
    [UserRole.TEACHER] : "green",
    [UserRole.SUPER_ADMIN] : "black",
}
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
        LABEL: "Логотип URL",
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