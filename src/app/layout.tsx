"use client"
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { StoresProvider } from "@/shared/store/RootStore"
import { roboto } from "@/app/fonts";
import { ConfigProvider } from "antd";
import React from "react";
import { ThemeProviders } from "./themeProviders"
import { themeConfig } from "@/shared/config/themeConfig";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={roboto.className}>
            <ConfigProvider theme={themeConfig}>
                <StoresProvider>
                    <AntdRegistry>
                        {children}
                    </AntdRegistry>
                </StoresProvider>
            </ConfigProvider>
            </body>
        </html>
    );
}
