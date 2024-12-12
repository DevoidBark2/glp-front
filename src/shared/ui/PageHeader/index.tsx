import { Button, Divider } from "antd";
import { PlusCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { FC } from "react";

interface PageHeaderProps {
    title: string;
    buttonTitle?: string;
    onClickButton?: () => void;
    showBottomDivider?: boolean;
    showMoreAction?: boolean
}

export const PageHeader: FC<PageHeaderProps> = ({ title, onClickButton, buttonTitle, showBottomDivider, showMoreAction }) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-gray-800 font-bold text-3xl mb-2">{title}</h1>
                {buttonTitle && <div>
                    <Button
                        className="flex items-center justify-center transition-transform transform hover:scale-105"
                        onClick={onClickButton}
                        icon={<PlusCircleOutlined />}
                        type="primary"
                    >
                        {buttonTitle}
                    </Button>
                    {showMoreAction && <Button className="ml-2" icon={<MoreOutlined />} />}
                </div>}
            </div>
            {showBottomDivider && <Divider />}
        </>
    );
}