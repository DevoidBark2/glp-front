"use client"
import {ColorPicker, Divider, Select, Spin} from "antd";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect} from "react";

const SettingsPage = () => {

    const {settingsStore} = useMobxStores()

    useEffect(() => {
        settingsStore.getUserSettings().finally(() => {
            settingsStore.setLoading(false)
        })
    },[])

    return(
        <div className="container mx-auto">
            <h1 className="text-4xl my-5">Настройки</h1>
            {
                !settingsStore.loading ? <div className="bg-[#f5f5f5] max-w-full p-5 rounded border flex flex-col">
                    <h2 className="text-2xl">Основные</h2>
                    <Divider/>
                    <div className="flex">
                        <div className="w-1/2 pl-2 pr-2">
                            <div className="flex items-center justify-between pb-2">
                                <h3>Цвет ребер</h3>
                                <ColorPicker
                                    value={settingsStore.userSettings ? settingsStore.userSettings.edge_color : ''}
                                    onChange={(value,hex) => {
                                        settingsStore.userSettings && (settingsStore.userSettings.edge_color = hex);
                                        settingsStore.changeSetting();
                                    }}
                                />
                            </div>
                            <Divider/>
                            <div className="flex items-center justify-between pb-2 mt-2">
                                <h3>Цвет вершин</h3>
                                <ColorPicker value={settingsStore.userSettings?.vertex_color} onChange={(value,hex) => {
                                    if (settingsStore.userSettings) {
                                        settingsStore.userSettings.vertex_color = hex;
                                        settingsStore.changeSetting();
                                    }
                                }} />
                            </div>
                            <Divider/>
                        </div>
                        <div className="w-1/2 border-l-2 pl-2 pr-2">
                            <div className="flex items-center justify-between pb-2">
                                <h3>Вид вершины</h3>
                                <Select className="w-40 p-3" value={settingsStore.userSettings?.type_vertex || ''} onChange={(value) => {
                                    if (settingsStore.userSettings) {
                                        settingsStore.userSettings.type_vertex = value;
                                        settingsStore.changeSetting();
                                    }
                                }}>
                                    <Select.Option value={"circle"}>Круг</Select.Option>
                                    <Select.Option value={"triangle"}>Треугольник</Select.Option>
                                    <Select.Option value={"square"}>Квадрат</Select.Option>
                                </Select>
                            </div>
                            <Divider/>
                            <div className="flex items-center justify-between pb-2">
                                <h3>Обводка вершины</h3>
                                <ColorPicker value={settingsStore.userSettings?.border_vertex || ''} onChange={(value, hex) => {
                                    if (settingsStore.userSettings) {
                                        settingsStore.userSettings.border_vertex = hex;
                                        settingsStore.changeSetting();
                                    }
                                }} />
                            </div>
                            <Divider/>
                        </div>
                    </div>
                </div>
                    : <div className="flex justify-center"><Spin size="large"/></div>
            }
        </div>
    )
}

export default observer(SettingsPage);