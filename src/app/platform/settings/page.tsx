"use client"
import {ColorPicker, Divider, Select} from "antd";

const SettingsPage = () => {
    return(
        <div className="container mx-auto">
            <h1 className="text-4xl my-5">Настройки</h1>
            <div className="bg-[#f5f5f5] max-w-full p-5 rounded border flex flex-col">
                <h2 className="text-2xl">Основные</h2>
                <Divider/>
                <div className="flex">
                    <div className="w-1/2 pl-2 pr-2">
                        <div className="flex items-center justify-between pb-2">
                            <h3>Цвет ребер</h3>
                            <ColorPicker defaultValue="#1677ff" disabledAlpha={true} />
                        </div>
                        <Divider/>
                        <div className="flex items-center justify-between pb-2 mt-2">
                            <h3>Цвет вершин</h3>
                            <ColorPicker defaultValue="#1677ff" disabledAlpha={true} />
                        </div>
                        <Divider/>
                    </div>
                    <div className="w-1/2 border-l-2 pl-2 pr-2">
                        <div className="flex items-center justify-between pb-2">
                            <h3>Вид вершины</h3>
                            <Select className="w-40 p-3" defaultValue={1}>
                                <Select.Option value={1}>Круг</Select.Option>
                                <Select.Option value={2}>Треугольник</Select.Option>
                                <Select.Option value={3}>Квадрат</Select.Option>
                            </Select>
                        </div>
                        <Divider/>
                        <div className="flex items-center justify-between pb-2">
                            <h3>Обводка вершины</h3>
                            <ColorPicker defaultValue="#1677ff" disabledAlpha={true} />
                        </div>
                        <Divider/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;