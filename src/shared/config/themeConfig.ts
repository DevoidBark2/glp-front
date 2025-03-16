import { Breadcrumb, ThemeConfig } from "antd";
import {Theme} from "emoji-picker-react";

import { MAIN_COLOR } from "../constants";

export const themeConfig: ThemeConfig = {
    components: {
        Button: {
            colorPrimaryBorderHover: "black",
            colorPrimaryActive: "black",
            defaultBorderColor: "black",
            colorPrimaryBg: "black",
            primaryColor: "black",
            colorPrimaryText: "white",
            colorPrimaryTextHover: "white"
        },
        Breadcrumb: {
            colorPrimary: MAIN_COLOR,
        },
        Radio: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryActive: MAIN_COLOR,
            colorPrimaryBgHover: MAIN_COLOR,
            colorPrimaryHover: MAIN_COLOR
        },
        Input: {
            colorPrimaryHover: "black",
            colorPrimaryActive: "black",
            colorPrimaryBorder: "black",
            colorPrimaryBorderHover: "black",
            colorInfoActive: "black"
        },
        DatePicker: {
            colorPrimaryHover: MAIN_COLOR,
            colorPrimaryActive: MAIN_COLOR,
            colorPrimaryBorder: MAIN_COLOR
        },
        Menu: {
            // darkPrimary: MAIN_COLOR,
            // darkItemBg: MAIN_COLOR,
            // darkColor: MAIN_COLOR,
            colorPrimary: MAIN_COLOR,
            colorPrimaryBg: MAIN_COLOR,
            colorBgLayout: MAIN_COLOR,
            colorPrimaryActive: MAIN_COLOR,
            colorPrimaryBgHover: MAIN_COLOR,
        },
        Spin: {
            colorPrimary: MAIN_COLOR
        },
        Pagination: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryHover: MAIN_COLOR
        },
        Tabs: {
            colorPrimary: "black",
            colorPrimaryHover: "black",
            colorPrimaryActive: "black",
            colorPrimaryBg: "grey"
        },
        Checkbox: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryHover: "#025834"
        },
        Table: {
            colorPrimary: "back"
        },
        // Switch: {
        //     colorPrimary: "#00FFFF",
        //     colorPrimaryHover: "#00FFFF"
        // },
    },
    token: {

    }
}