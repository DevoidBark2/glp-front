import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Switch } from "antd";
import { BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) {return (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
    );}

    return (
        <motion.div
            className="flex items-center justify-between px-3 py-1 rounded-full shadow-md bg-gray-200 dark:bg-gray-800 transition-all w-24"
        >
            <AnimatePresence mode="wait">
                {resolvedTheme === "dark" ? (
                    <motion.span
                        key="moon"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="text-blue-400 text-lg"
                    >
                        <MoonOutlined />
                    </motion.span>
                ) : (
                    <motion.span
                        key="bulb"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="text-yellow-400 text-lg"
                    >
                        <BulbOutlined />
                    </motion.span>
                )}
            </AnimatePresence>

            <Switch
                checked={resolvedTheme === "dark"}
                onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                size="small"
                className="bg-gray-400 dark:bg-gray-600"
            />
        </motion.div>
    );
}
