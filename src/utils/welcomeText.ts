import dayjs from "dayjs";

export const welcomeTextRender = (dateTimeInHour: string) => {
    const currentTime = dayjs().toDate().getHours();
    let greeting = "";

    if (currentTime >= 6 && currentTime < 12) {
        greeting = "Доброе утро!";
    } else if (currentTime >= 12 && currentTime < 18) {
        greeting = "Добрый день!";
    } else {
        greeting = "Доброй ночи!";
    }

    return greeting;
}