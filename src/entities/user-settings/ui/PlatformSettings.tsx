import ThemeSwitch from "@/shared/ui/themeSwitch";
import { Divider } from "antd";
import { useTheme } from "next-themes";

export const PlatformSettings = () => {
    const { resolvedTheme } = useTheme()
    return <div>
        <p className="text-xl font-semibold dark:text-white">Смена темы</p>
        <Divider style={{ borderColor: resolvedTheme === "dark" ? "gray" : undefined }} />
        <ThemeSwitch />
    </div>
}