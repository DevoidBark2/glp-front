import {PlatformMenu} from "@/types/platformMenu";

export const MAIN_COLOR = "#00b96b"

export let platformMenu = [
    { key: 1, title: "Главная", link: '/platform' },
    { key: 2, title: "Визуализация", link: '/platform/graphs' },
    { key: 3, title: "Курсы", link: '/platform/courses' },
    { key: 4, title: "Настройки", link: '/platform/settings' },
]

export const convertTimeFromStringToDate = (timeString) => {
    const today = new Date();
    const [hours, minutes] = timeString.split(':');
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
};
