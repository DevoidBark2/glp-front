import React, { FC } from "react"

interface PageContainerControlPanelProps {
    children: React.ReactNode
}

export const PageContainerControlPanel: FC<PageContainerControlPanelProps> = ({ children }) => {
    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen">
            {children}
        </div>
    )
}