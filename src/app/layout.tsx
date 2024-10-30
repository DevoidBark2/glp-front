"use client"
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {StoresProvider} from "@/stores/stores"
import {roboto} from "@/app/fonts";
import {ConfigProvider} from "antd";
import React from "react";
import {MAIN_COLOR} from "@/constants";
import {ThemeProviders} from "./themeProviders"

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
                           colorPrimaryBorderHover: MAIN_COLOR,
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
                           colorPrimaryActive: MAIN_COLOR,
                       },
                       Checkbox: {
                           colorPrimary: MAIN_COLOR,
                           colorPrimaryHover: "#025834"
                       },
                       Table:{
                           colorPrimary: "back"
                       },
                       Switch: {
                           colorPrimary: MAIN_COLOR,
                           // colorPrimaryHover: MAIN_COLOR
                       }
                   },
                   token: {

                   }
               }}
           >
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
