"use client"
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {StoresProvider} from "@/stores/stores"
import {roboto} from "@/app/fonts";
import {ConfigProvider} from "antd";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ConfigProvider
            theme={{
              components: {
                Button: {
                    colorPrimaryBorderHover: 'red',
                    colorPrimaryHover: '#02d079',
                    colorPrimary: '#00b96b',
                    colorPrimaryActive: 'lightgray',
                    colorPrimaryTextHover: 'lightgray',
                },
                Radio: {
                   colorPrimary: "#00b96b",
                    colorPrimaryActive: '#02d079',
                    colorPrimaryBgHover: "#00b96b",
                    colorPrimaryHover: "#00b96b"
                },
                Input: {
                    colorPrimaryHover: "#00b96b",
                    colorPrimaryActive: "#00b96b",
                    colorPrimaryBorder: "#00b96b",
                },
                  DatePicker: {
                      colorPrimaryHover: "#00b96b",
                      colorPrimaryActive: "#00b96b",
                      colorPrimaryBorder: "#00b96b"
                  },
              }
            }}
        >
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
