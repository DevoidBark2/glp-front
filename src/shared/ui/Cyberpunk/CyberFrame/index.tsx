import React from "react";

interface CyberFrameProps {
    children: React.ReactNode;
    width?: string;
    height?: string;
    bgColor?: string;
    borderColor?: string;
}

const CyberFrame = ({
                        children,
                        width = "300px",
                        bgColor = "bg-cyan-950",
                        borderColor = "border-cyan-400"
                    }: CyberFrameProps) => (
        <div className={`relative ${bgColor} p-4`} style={{ width }}>
            <div className={`absolute top-0 left-0 w-[40px] h-[40px] border-t-2 border-l-2 ${borderColor} pointer-events-none`}></div>

            <div className={`absolute bottom-0 right-0 w-[40px] h-[40px] border-b-2 border-r-2 ${borderColor} pointer-events-none`}></div>

            <div className="relative z-10 text-white">{children}</div>
        </div>
    );

export default CyberFrame;
