import React from "react";
import { Divider } from "antd";
import { useTheme } from "next-themes";

import ThemeSwitch from "@/shared/ui/themeSwitch";

export const PlatformSettings = () => {
    const { resolvedTheme } = useTheme()
    return <div>
        <p className="text-xl font-semibold dark:text-white">Смена темы</p>
        <Divider style={{ borderColor: resolvedTheme === "dark" ? "gray" : undefined }} />
        <ThemeSwitch />
    </div>
}