import { Breadcrumb, Divider } from "antd";
import { BreadcrumbItemType } from "antd/lib/breadcrumb/Breadcrumb";
import { FC } from "react";

interface BreadCrumbsComponentProps {
    items: BreadcrumbItemType[];
    currentPageTitle: string
    showBottomDivider?: boolean
}

const BreadCrumbsComponent: FC<BreadCrumbsComponentProps> = ({ items, currentPageTitle, showBottomDivider }) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <Breadcrumb items={items} />
                </div>
                <h1 className="text-gray-800 font-bold text-3xl mb-2">{currentPageTitle}</h1>
                <div></div>

            </div>
            {showBottomDivider && <Divider />}
        </>
    );
}

export default BreadCrumbsComponent;