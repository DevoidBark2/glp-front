import React from "react";

interface FrameNeonUnderlineProps {
    children: React.ReactNode;
    underline?: boolean;
    textColor?: string;
    underlineColor?: string;
}

const FrameNeonUnderline: React.FC<FrameNeonUnderlineProps> = ({ children, underline = false,textColor }) => {
    return (
        <div className="relative inline-block w-full">
            <h1 className={`text-2xl py-4 font-bold text-${textColor}-300 ${underline && "border-b-2 border-b-cyan-400"}`}>
                {children}
            </h1>
        </div>
    );
};

export default FrameNeonUnderline;
