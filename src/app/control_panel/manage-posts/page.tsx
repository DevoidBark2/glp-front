"use client"
import {observer} from "mobx-react";
import {Button, Divider, Input, Table, Tooltip} from "antd";
import React from "react";
import {InfoCircleOutlined} from "@ant-design/icons";

const ManagePostPage = () => {
    return (
        <div className="bg-white h-full p-5">
            <div className="bg-gray-50 p-5 rounded-lg shadow-md mb-5">
                <div className="flex items-center">
                    <InfoCircleOutlined className="text-2xl text-blue-600 mr-3"/>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Информация о модерации постов</h2>
                        <p className="text-gray-600 mt-1">
                            Здесь вы можете управлять основными параметрами вашего приложения, включая безопасность,
                            настройки доступа и другие важные параметры. Обратите внимание на значок <Tooltip
                            title="Информация"><InfoCircleOutlined/></Tooltip>, чтобы получить подробную информацию о
                            каждом параметре.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <h1 className="text-green-800 font-bold text-3xl mb-2">Модерация постов</h1>
            </div>
            <Divider/>

        </div>
    );
}

export default observer(ManagePostPage);