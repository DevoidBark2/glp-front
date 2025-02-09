import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { StoresProvider } from "@/shared/store/RootStore"
import { roboto } from "@/app/fonts";
import { ConfigProvider } from "antd";
import React from "react";
import { themeConfig } from "@/shared/config/themeConfig";
import { Metadata } from "next";
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
