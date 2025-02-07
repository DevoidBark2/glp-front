import { MAIN_COLOR } from "../constants";

export const themeConfig = {
    components: {
        Button: {
            colorPrimaryBorderHover: MAIN_COLOR,
            colorPrimaryHover: MAIN_COLOR,
            colorPrimary: MAIN_COLOR,
            colorPrimaryActive: 'lightgray',
            colorPrimaryTextHover: 'lightgray',
        },
        FloatButton: {
            colorPrimaryHover: MAIN_COLOR,
            colorPrimary: MAIN_COLOR,
            colorPrimaryActive: 'lightgray',
            colorPrimaryTextHover: 'lightgray',
        },
        Radio: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryActive: MAIN_COLOR,
            colorPrimaryBgHover: MAIN_COLOR,
            colorPrimaryHover: MAIN_COLOR
        },
        Input: {
            colorPrimaryHover: MAIN_COLOR,
            colorPrimaryActive: MAIN_COLOR,
            colorPrimaryBorder: MAIN_COLOR,
            colorPrimaryBorderHover: MAIN_COLOR,
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
            colorPrimaryBgHover: MAIN_COLOR
        },
        Spin: {
            colorPrimary: MAIN_COLOR
        },
        Pagination: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryHover: MAIN_COLOR
        },
        Tabs: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryHover: MAIN_COLOR,
            colorPrimaryActive: MAIN_COLOR,
        },
        Checkbox: {
            colorPrimary: MAIN_COLOR,
            colorPrimaryHover: "#025834"
        },
        Table: {
            colorPrimary: "back"
        },
        Switch: {
            colorPrimary: MAIN_COLOR,
            // colorPrimaryHover: MAIN_COLOR
        }
    },
    token: {

    }
}