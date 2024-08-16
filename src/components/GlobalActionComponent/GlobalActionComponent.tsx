import { observer } from "mobx-react";
import Image from "next/image";
import { Modal, Button, Tooltip, Checkbox, Input, Progress, Steps, message } from "antd";
import { useState } from "react";
import { FileExcelOutlined, FileImageOutlined, FilePdfOutlined } from "@ant-design/icons";

const { Step } = Steps;

const GlobalActionComponent = ({ handleDelete, handleExport }: { handleDelete: (value:any) => void, handleExport: () => void }) => {
    const [openExportModal, setOpenExportModal] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>("exported_file");
    const [compression, setCompression] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [exportInProgress, setExportInProgress] = useState<boolean>(false);
    const [progressPercent, setProgressPercent] = useState<number>(0);
    const [email, setEmail] = useState<string>("");

    const formatOptions = [
        { label: "Excel", value: "excel", icon: <FileExcelOutlined style={{ fontSize: '48px', color: '#28a745' }} />, imgSrc: "/static/excel_icon.svg" },
        { label: "PNG", value: "png", icon: <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />, imgSrc: "/static/png_icon.svg" },
        { label: "PDF", value: "pdf", icon: <FilePdfOutlined style={{ fontSize: '48px', color: '#d9534f' }} />, imgSrc: "/static/pdf_icon.svg" }
    ];

    const handleFormatSelection = (format: string) => {
        setSelectedFormats(prev => {
            if (prev.includes(format)) {
                return prev.filter(f => f !== format);
            } else {
                return [...prev, format];
            }
        });
    };

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            startExport();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const startExport = () => {
        setExportInProgress(true);
        setCurrentStep(2);
        setProgressPercent(0);

        const interval = setInterval(() => {
            setProgressPercent(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    message.success("Экспорт завершен!");
                    setOpenExportModal(false);
                    setExportInProgress(false);
                    return 100;
                }
                return prev + 20;
            });
        }, 500);
    };

    const savePreset = () => {
        const preset = {
            formats: selectedFormats,
            fileName,
            compression,
            email,
        };
        localStorage.setItem("exportPreset", JSON.stringify(preset));
        message.success("Конфигурация сохранена!");
    };

    const loadPreset = () => {
        const preset = JSON.parse(localStorage.getItem("exportPreset") || "{}");
        if (preset) {
            setSelectedFormats(preset.formats || []);
            setFileName(preset.fileName || "exported_file");
            setCompression(preset.compression || false);
            setEmail(preset.email || "");
            message.success("Конфигурация загружена!");
        }
    };

    const resetSelections = () => {
        setSelectedFormats([]);
        // setFilter(null);
        setFileName("exported_file");
        setCompression(false);
        setCurrentStep(0);
        setEmail("");
    };

    return (
        <>
            <Modal
                open={openExportModal}
                onOk={handleNext}
                title={"Экспорт (выбор формата)"}
                className="flex flex-col justify-center items-center"
                okButtonProps={{ disabled: selectedFormats.length === 0 || exportInProgress }}
                okText={currentStep < 2 ? "Далее" : "Начать экспорт"}
                cancelText={currentStep > 0 ? "Назад" : "Отменить"}
                onCancel={currentStep > 0 ? handlePrev : () => setOpenExportModal(false)}
                footer={currentStep === 0 ? [
                    <Button key="loadPreset" onClick={loadPreset}>Загрузить конфигурацию</Button>,
                    <Button key="reset" onClick={resetSelections}>Сбросить фильтры</Button>,
                    <Button key="cancel" onClick={() => setOpenExportModal(false)}>Отменить</Button>,
                    <Button key="next" type="primary" onClick={handleNext} disabled={selectedFormats.length === 0}>Далее</Button>,
                ] : null}
            >
                <Steps current={currentStep}>
                    <Step title="Выбор формата" />
                    <Step title="Настройки экспорта" />
                    <Step title="Экспортирование" />
                </Steps>

                {currentStep === 0 && (
                    <div className="w-full mt-4">
                        <div className="flex justify-center gap-4 p-4">
                            {formatOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`bg-white rounded shadow-md p-4 hover:bg-gray-100 hover:shadow-lg cursor-pointer transition-all duration-300 ${selectedFormats.includes(option.value) ? 'ring-2 ring-blue-500' : ''}`}
                                    onClick={() => handleFormatSelection(option.value)}
                                >
                                    {option.icon}
                                    <Checkbox
                                        checked={selectedFormats.includes(option.value)}
                                        style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}
                                    >
                                        {option.label}
                                    </Checkbox>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="w-full mt-4">
                        <Input
                            placeholder="Имя файла"
                            value={fileName}
                            onChange={e => setFileName(e.target.value)}
                            className="mb-4"
                        />
                        <Checkbox
                            checked={compression}
                            onChange={e => setCompression(e.target.checked)}
                            className="mb-4"
                        >
                            Сжатие файла
                        </Checkbox>
                        <Input
                            placeholder="Email для отправки"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mb-4"
                        />
                        <Button type="link" onClick={savePreset}>Сохранить конфигурацию</Button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="w-full mt-4 text-center">
                        <Progress percent={progressPercent} />
                        {exportInProgress && <p>Идет экспорт, пожалуйста, подождите...</p>}
                    </div>
                )}
            </Modal>

            <div className="flex items-center space-x-4">
                <Tooltip title="Массовое удаление">
                    <Image
                        src="/static/delete_icon.svg"
                        alt="Массовое удаление"
                        width={30}
                        height={30}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={handleDelete}
                    />
                </Tooltip>
                <Tooltip title="Массовый экспорт">
                    <Image
                        src="/static/export_icon.svg"
                        alt="Массовый экспорт"
                        width={30}
                        height={30}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={() => setOpenExportModal(true)}
                    />
                </Tooltip>
            </div>
        </>
    );
};

export default observer(GlobalActionComponent);
