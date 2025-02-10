import React, { useEffect, useState } from 'react';

type SciFiNotificationProps = {
    message: string;
    onClose: () => void;
};

const SciFiNotification: React.FC<SciFiNotificationProps> = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Убираем уведомление через несколько секунд
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsVisible(false);
    //         onClose(); // Закрываем уведомление
    //     }, 5000); // Уведомление исчезает через 5 секунд
    //
    //     return () => clearTimeout(timer);
    // }, [onClose]);

    return (
        <div
            className={`fixed top-10 right-10 w-80 bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-white rounded-xl p-6 transform transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
                boxShadow: '0 0 30px rgba(255, 105, 180, 0.8), 0 0 60px rgba(255, 105, 180, 0.6), 0 0 90px rgba(255, 105, 180, 0.4)', // Deep neon glow
                border: '2px solid rgba(255, 255, 255, 0.2)', // Subtle neon border
                borderRadius: '15px 35px 15px 35px', // Unique corner rounding
                clipPath: 'polygon(0% 10%, 80% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)', // Custom geometric shape
                background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))', // Soft dark gradient
            }}
        >
            {/* Outer Red Border Lines (using pseudo-elements) */}
            {/*<div className="absolute top-0 left-0 w-full h-full">*/}
            {/*    <div className="absolute top-0 left-0 w-full h-2 bg-red-800"></div>*/}
            {/*    <div className="absolute bottom-0 left-0 w-full h-2 bg-red-800"></div>*/}
            {/*    <div className="absolute top-0 left-0 w-2 h-full bg-red-800"></div>*/}
            {/*    <div className="absolute top-0 right-0 w-2 h-full bg-red-800"></div>*/}
            {/*</div>*/}

            <div className="relative flex justify-between items-center">
                <div className="text-xl font-bold"
                     style={{textShadow: '0 0 15px rgba(255, 105, 180, 0.8)'}}>{message}</div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose();
                    }}
                    className="ml-4 text-2xl font-bold text-white hover:text-yellow-400 transition-all"
                    style={{textShadow: '0 0 10px rgba(255, 105, 180, 0.8)'}}
                >
                    ×
                </button>
            </div>
        </div>

    );
};

export default SciFiNotification;
