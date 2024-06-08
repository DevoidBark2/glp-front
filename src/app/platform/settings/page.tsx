import {ColorPicker, Divider} from "antd";

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
                        <div className="flex items-center justify-between border-b-2 pb-2 mt-2">
                            <h3>Цвет вершин</h3>
                            <ColorPicker defaultValue="#1677ff" disabledAlpha={true} />
                        </div>
                    </div>
                    <div className="w-1/2 border-l-2 pl-2 pr-2">

                        <ColorPicker defaultValue="#1677ff" disabledAlpha={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;