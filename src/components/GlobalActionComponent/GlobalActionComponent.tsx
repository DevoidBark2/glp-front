import { observer } from "mobx-react";
import Image from "next/image";
import {Modal} from "antd";
import {useState} from "react";

const GlobalActionComponent = ({handleDelete,handleExport} : {handleDelete: () => void,handleExport: () => void}) => {
    const [openExportModal,setOpenExportModal] = useState(false)
    return (
        <>
            <Modal
                open={openExportModal}
                onCancel={() => setOpenExportModal(false)}
                onOk={handleExport}
                title={"Экспорт(выбор формата)"}
                className="flex flex-col justify-center items-center"
            >
                <div className="flex justify-center gap-4 p-4">
                    <Image
                        src="/static/excel_icon.svg"
                        alt="Excel"
                        width={100}
                        height={100}
                        className="bg-white rounded shadow-md p-2 hover:bg-gray-200 hover:shadow-lg"
                    />
                    <Image
                        src="/static/png_icon.svg"
                        alt="Excel"
                        width={100}
                        height={100}
                        className="bg-white rounded shadow-md p-2 hover:bg-gray-200 hover:shadow-lg"
                    />
                </div>
            </Modal>
            <div className="flex items-center">
                <Image
                    src={"/static/delete_icon.svg"}
                    alt="Массовое удаление"
                    width={30}
                    height={30}
                    className="cursor-pointer"
                    onClick={handleDelete}
                />
                <div className="delete-icon hover:bg-red-500"/>
                <Image
                    src={"/static/export_icon.svg"}
                    alt="Массовое экспорт"
                    width={30}
                    height={30}
                    className="cursor-pointer ml-2"
                    onClick={() => setOpenExportModal(true)}
                />
                <div className="export-icon hover:bg-blue-500"/>
            </div>
        </>
    );
};

export default observer(GlobalActionComponent);