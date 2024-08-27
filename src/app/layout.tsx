"use client"
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {StoresProvider} from "@/stores/stores"
import {roboto} from "@/app/fonts";
import {ConfigProvider} from "antd";
import React from "react";
import {MAIN_COLOR} from "@/constants";
import {ThemeProviders} from "./themeProviders"
import {lightTheme} from "@/themes/light_theme";
import {darkTheme} from "@/themes/dark_theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
       <ThemeProviders>
           <ConfigProvider
               theme={{
                   components: {
                       Button: {
                           colorPrimaryBorderHover: MAIN_COLOR,
                           colorPrimaryHover: MAIN_COLOR,
                           colorPrimary: MAIN_COLOR,
                           colorPrimaryActive: 'lightgray',
                           colorPrimaryTextHover: 'lightgray',
                       },
                       FloatButton: {
                           colorPrimaryHover:MAIN_COLOR,
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
                           colorPrimaryBorder:MAIN_COLOR,
                       },
                       DatePicker: {
                           colorPrimaryHover: MAIN_COLOR,
                           colorPrimaryActive: MAIN_COLOR,
                           colorPrimaryBorder: MAIN_COLOR
                       },
                       Menu: {
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
                           colorPrimaryActive: MAIN_COLOR
                       },
                       Switch: {
                           colorPrimary: MAIN_COLOR,
                           // colorPrimaryHover: MAIN_COLOR
                       }
                   }
               }}
           >
               <StoresProvider>
                   <AntdRegistry>
                       <div className={`bg-[${lightTheme.background}] dark:bg-[${darkTheme.background}]`}>{children}</div>
                   </AntdRegistry>
               </StoresProvider>
           </ConfigProvider>
       </ThemeProviders>
      </body>
    </html>
  );
}
