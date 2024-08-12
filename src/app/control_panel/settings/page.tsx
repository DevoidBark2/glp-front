"use client"
import {Button, Divider, Segmented, Table} from "antd";
import React from "react";
import {Input} from "antd/lib";

const SettingsControlPage = () => {
    return (
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl mb-2">Настройки</h1>

                </div>
                <Divider/>

                <Input title="Ключ доступа" placeholder="Введите регулярку для ключа"/>

                <Segmented<string>
                    value={'Monthly'}
                    options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']}
                    onChange={(value) => {
                        console.log(value); // string
                    }}
                />
            </div>
        </div>
    )
}

export default SettingsControlPage;