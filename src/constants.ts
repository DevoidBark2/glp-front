import { StatusCourseEnum } from "@/enums/StatusCourseEnum";
import { ActionEvent } from "@/enums/ActionEventUser";
import { CourseComponentType } from "@/enums/CourseComponentType";
import { StatusComponentTaskEnum } from "@/enums/StatusComponentTaskEnum";
import { PostStatusEnum } from "@/enums/PostStatusEnum";
import { UserRole } from "@/enums/UserRoleEnum";
import { StatusUserEnum } from "@/enums/StatusUserEnum";
import { AchievementTypeEnum, Condition, ConditionTypeEnum } from "./stores/AchievementsStore";
import { StatusAvatarIconEnum } from "./enums/StatusAvatarIconEnum";

export const MAIN_COLOR = "#00b96b"
export const UNAUTHORIZED_STATUS_CODE = 401

export type PlatformMenu = {
    key: number;
    title: string;
    link: string;
}

export const platformMenu: PlatformMenu[] = [
    { key: 1, title: "Главная", link: '/platform' },
    { key: 3, title: "Курсы", link: '/platform/courses' },
]
export const FILTER_STATUS_POST = [
    { id: 1, text: 'Новый', value: PostStatusEnum.NEW },
    { id: 2, text: 'В обработке', value: PostStatusEnum.IN_PROCESSING },
    { id: 2, text: 'Подтвержден', value: PostStatusEnum.APPROVED },
    { id: 4, text: 'Отклонен', value: PostStatusEnum.REJECT },
]

export const FILTER_STATUS_AVATAR_ICONS = [
    { id: 1, text: 'Активный', value: StatusAvatarIconEnum.ACTIVE },
    { id: 2, text: 'Не активный', value: StatusAvatarIconEnum.DISABLED },
]


export const FILTER_ROLE_USER = [
    { id: 1, text: 'Пользователь', value: UserRole.STUDENT },
    { id: 2, text: 'Модератор', value: UserRole.MODERATOR },
    { id: 3, text: 'Учитель', value: UserRole.TEACHER },
]

export const FILTER_TYPE_COMPONENT_COURSE = [
    { id: 1, text: 'Текст', value: CourseComponentType.Text },
    { id: 2, text: 'Квиз', value: CourseComponentType.Quiz },
    { id: 3, text: 'Программирование', value: CourseComponentType.Coding },
]

export const FILTER_STATUS_COMPONENT_COURSE = [
    { id: 1, text: 'Активен', value: StatusComponentTaskEnum.ACTIVATED },
    { id: 2, text: 'Неактивен', value: StatusComponentTaskEnum.DEACTIVATED },
]

export const FILTER_STATUS_USER = [
    { id: 1, text: 'Активен', value: StatusUserEnum.ACTIVATED },
    { id: 2, text: 'Неактивен', value: StatusUserEnum.DEACTIVATED },
    { id: 3, text: 'Удален', value: StatusUserEnum.DELETED },
    { id: 4, text: 'Заблокирован', value: StatusUserEnum.BLOCKED },
]

export const LEVEL_COURSE = [
    { id: 1, title: 'Начинающий' },
    { id: 2, title: 'Средний' },
    { id: 3, title: 'Высокий' },
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


export const conditionForAchievements: Condition[] = [
    { id: 1, condition: ConditionTypeEnum.COMPLETE_COURSES, title: "Пройди N курсов", type: AchievementTypeEnum.LEARNING },
    { id: 2, condition: ConditionTypeEnum.COMPLETE_MODULE, title: "Заверши N модулей в курсе.", type: AchievementTypeEnum.LEARNING },
    { id: 3, condition: ConditionTypeEnum.EARN_POINTS, title: "Заработай N баллов на платформе", type: AchievementTypeEnum.POINTS },
    { id: 4, condition: ConditionTypeEnum.ATTEND_EVENT, title: "Прими участие в N вебинарах или событиях", type: AchievementTypeEnum.PARTICIPATION },
    { id: 5, condition: ConditionTypeEnum.LOGIN_STREAK, title: "Заходи на платформу каждый день в течение N дней", type: AchievementTypeEnum.ACTIVITY },
    { id: 6, condition: ConditionTypeEnum.COMPLETE_ASSESSMENT, title: "Пройди N тестов с результатом выше 80%", type: AchievementTypeEnum.LEARNING },
    { id: 7, condition: ConditionTypeEnum.SUBMIT_ASSIGNMENTS, title: "Отправь N домашних заданий", type: AchievementTypeEnum.LEARNING },
    { id: 8, condition: ConditionTypeEnum.MENTOR_STUDENTS, title: "Наставляй N других студентов", type: AchievementTypeEnum.INTERACTION },
    { id: 9, condition: ConditionTypeEnum.GIVE_FEEDBACK, title: "Оставь N отзывов о пройденных курсах", type: AchievementTypeEnum.INTERACTION },
    { id: 10, condition: ConditionTypeEnum.PARTICIPATE_DISCUSSIONS, title: "Участвуй в N обсуждениях на форуме", type: AchievementTypeEnum.INTERACTION },
    { id: 11, condition: ConditionTypeEnum.WATCH_VIDEOS, title: "Просмотри N видеоуроков", type: AchievementTypeEnum.LEARNING },
    { id: 12, condition: ConditionTypeEnum.COMPLETE_QUIZ, title: "Заверши N коротких квизов по курсу", type: AchievementTypeEnum.LEARNING },
    { id: 13, condition: ConditionTypeEnum.EARN_CERTIFICATES, title: "Получи N сертификатов за завершенные курсы", type: AchievementTypeEnum.ACHIEVEMENTS },
    { id: 14, condition: ConditionTypeEnum.SHARE_COURSE, title: "Поделись курсом с N друзьями", type: AchievementTypeEnum.INTERACTION },
    { id: 15, condition: ConditionTypeEnum.CREATE_COURSE_CONTENT, title: "Создай N курсов или уроков", type: AchievementTypeEnum.CONTENT_CREATION },
    { id: 16, condition: ConditionTypeEnum.RECEIVE_UPVOTES, title: "Получи N лайков/оценок на свои ответы в обсуждениях", type: AchievementTypeEnum.INTERACTION },
    { id: 17, condition: ConditionTypeEnum.ACHIEVE_HIGH_SCORE, title: "Получи максимальный балл в N тестах", type: AchievementTypeEnum.POINTS },
    { id: 18, condition: ConditionTypeEnum.REFER_FRIENDS, title: "Приведи N новых пользователей на платформу", type: AchievementTypeEnum.REFERRALS },
    { id: 19, condition: ConditionTypeEnum.STUDY_HOURS, title: "Проведи N часов на платформе, изучая материалы", type: AchievementTypeEnum.ACTIVITY },
    { id: 20, condition: ConditionTypeEnum.EARN_BADGES, title: "Получи N различных бейджей", type: AchievementTypeEnum.ACHIEVEMENTS },
    { id: 21, condition: ConditionTypeEnum.COMPLETE_CHALLENGES, title: "Заверши N учебных вызовов", type: AchievementTypeEnum.LEARNING },
    { id: 22, condition: ConditionTypeEnum.COLLABORATE_PROJECT, title: "Прими участие в N командных проектах", type: AchievementTypeEnum.PARTICIPATION },
    { id: 23, condition: ConditionTypeEnum.COURSE_COMPLETION_STREAK, title: "Заверши по курсу каждую неделю в течение N недель", type: AchievementTypeEnum.ACTIVITY },
    { id: 24, condition: ConditionTypeEnum.TOP_LEARNER, title: "Войди в топ-10 активных учеников в течение месяца", type: AchievementTypeEnum.ACHIEVEMENTS },
    { id: 25, condition: ConditionTypeEnum.ATTEND_WORKSHOPS, title: "Пройди N мастер-классов", type: AchievementTypeEnum.PARTICIPATION },
    { id: 26, condition: ConditionTypeEnum.CREATE_DISCUSSION_TOPICS, title: "Создай N новых тем для обсуждения", type: AchievementTypeEnum.CONTENT_CREATION },
    { id: 27, condition: ConditionTypeEnum.SOLVE_PRACTICE_PROBLEMS, title: "Реши N практических задач", type: AchievementTypeEnum.LEARNING },
    { id: 28, condition: ConditionTypeEnum.REVIEW_MATERIALS, title: "Просмотри N дополнительных материалов или ресурсов", type: AchievementTypeEnum.LEARNING },
    { id: 29, condition: ConditionTypeEnum.GET_FEEDBACK_FROM_INSTRUCTOR, title: "Получи N положительных отзывов от преподавателя", type: AchievementTypeEnum.INTERACTION },
    { id: 30, condition: ConditionTypeEnum.EARLY_BIRD, title: "Запишись на курс в течение 24 часов с момента его анонса", type: AchievementTypeEnum.ACTIVITY },
];

// Массив типов достижений
export const typesConsitions = [
    "Обучение",
    "Баллы",
    "Участие",
    "Активность",
    "Взаимодействие",
    "Достижения",
    "Создание контента",
    "Рефералы"
];