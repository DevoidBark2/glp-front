import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from "antd";
import React from "react";
import { Metadata } from "next";

import { StoresProvider } from "@/shared/store/RootStore"
import { roboto } from "@/app/fonts";
import { themeConfig } from "@/shared/config/themeConfig";


import { ThemeProviders } from "./themeProviders";

export const metadata: Metadata = {
    title: 'Learnify',
    description: 'Education System',
    icons: {
        icon: ['/favicon.ico'],
        apple: ['/apple-touch-icon.png'],
        shortcut: ['/apple-touch-icon.png'],
    }
}


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={roboto.className}>
                <ThemeProviders>
                    <ConfigProvider theme={themeConfig}>
                        <StoresProvider>
                            <AntdRegistry>
                                {children}
                            </AntdRegistry>
                        </StoresProvider>
                    </ConfigProvider>
                </ThemeProviders>
            </body>
        </html>
    );
}
