import cookieCutter from "cookie-cutter";
import {isServer} from "./fetcher";

const AUTH_USER_TYPE = "authenticated";
const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";
const COOKIE_NAME = "userToken";

export const set_cookie = function (name, data) {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));

    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + data + ";" + expires + ";path=/";
};
export const delete_cookie_by_name = function (name) {
    const d = new Date();
    d.setTime(d.getTime());
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=; " + expires + ";path=/";
};

export const delete_cookie = () => {
    if (typeof window !== "undefined") {
        // Устанавливаем куки с прошедшей датой для удаления
        document.cookie = `${COOKIE_NAME}=; Max-Age=-99999999; path=/`;
    }
};

export const setActiveUser = (value) => {
    if (typeof window !== "undefined") {
        set_cookie("isActiveUser", JSON.stringify(value));
    }
}
export const signInUser = (data) => {
    if (typeof window !== "undefined") {
        window[WINDOW_USER_SCRIPT_VARIABLE] = data;
        const userData = {
            user: data,
            type: AUTH_USER_TYPE,
        };
        set_cookie(COOKIE_NAME, JSON.stringify(userData));
    }
    return data;
};

export const setAdminUser = (value) => {
    if (typeof window !== "undefined") {
        set_cookie("admin_auth", value);
    }
}
export const deleteAuthAdmin = () => {
    cookieCutter.set("admin_auth", "", { expires: new Date(0) });
}
export const isAdminUser = () => {
    if(!isServer){
        const user = cookieCutter.get("admin_auth");

        if (user) {
            const userValues = JSON.parse(user);

            if (userValues) {
                return true;
            }
        }

        return false;
    }
}

export const getCookieUserDetails = () => {
    if(!isServer){
        const user = cookieCutter.get(COOKIE_NAME);

        if (user) {
            return JSON.parse(user);
        }

        return null;
    }
}
export const getUserRole = () => {
    if(!isServer){
        const user = cookieCutter.get(COOKIE_NAME);

        if (user) {
            const userValues = JSON.parse(user);
            if (userValues.user && userValues.user.email) {
                return {role: userValues.user.role};
            }
        }

        return null;
    }
    return null;
}

export const getUserFIO = () => {
    if(!isServer){
        const user = cookieCutter.get(COOKIE_NAME);

        if (user) {
            const userValues = JSON.parse(user);
            if (userValues.user && userValues.user.user_name) {
                return userValues.user.user_name;
            }
        }

        return null;
    }
    return null;
}

export const getUserToken = () => {
    const user = cookieCutter.get(COOKIE_NAME);

    if (user) {
        const userValues = JSON.parse(user);
        if (userValues.user && userValues.user.token) {
            return userValues.user.token;
        }
    }

    return null;
}