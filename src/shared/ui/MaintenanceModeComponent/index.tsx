import React, { FC } from 'react';
import { Typography } from 'antd';
import { FrownOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface MaintenanceModeProps {
    serviceModeText?: string;
}

export const MaintenanceModeComponent: FC<MaintenanceModeProps> = ({ serviceModeText }) => (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 text-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-opacity-30 bg-cover bg-center animate-pulse" />
            <div className="bg-white p-10 rounded-3xl shadow-3xl transform transition-transform hover:scale-105 relative z-10">
                <FrownOutlined className="text-8xl text-red-600 mb-6 transition-transform transform hover:rotate-12" />
                <Title level={1} className="text-red-600 text-4xl mb-6 font-extrabold animate__animated animate__fadeIn">
                    В данный момент сайт находится на обслуживании
                </Title>
                <div className='flex items-center justify-center'>
                    <Paragraph className="text-lg mb-6 leading-relaxed animate__animated animate__fadeIn animate__delay-1s w-1/2">
                        {serviceModeText}
                    </Paragraph>
                </div>
            </div>
        </div>
    );
