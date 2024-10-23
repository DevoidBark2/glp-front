"use client";
import React, { useEffect, useState } from 'react';
import HeaderBlock from "../../components/Header/Header";
import MaintenanceMode from "@/components/MaintenanceModeComponent/MaintenanceModeComponent";
import { observer } from 'mobx-react';
import { useMobxStores } from '@/stores/stores';
import { Spin } from 'antd';
import Link from 'next/link';
import nextConfig from 'next.config.mjs';
import { usePathname, useRouter } from 'next/navigation';

interface LayoutProps {
    children: React.ReactNode;
}

interface FooterInfo {
    subscription_platform: string;
    platform_name: string;
    support_email: string;
    contact_phone: string;
    service_mode_text: string;
    logo_url: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { generalSettingsStore } = useMobxStores();
    const [serviceMode, setServiceMode] = useState(false);
    const [footerInfo, setFooterInfo] = useState<FooterInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        generalSettingsStore.getGeneralSettings().then(response => {
            setServiceMode(response.data[0].service_mode);
            if (response.data[0].service_mode) {
                router.push('/platform');
            }
            setFooterInfo({ subscription_platform: response.data[0].subscription_platform, platform_name: response.data[0].platform_name, support_email: response.data[0].support_email, contact_phone: response.data[0].contact_phone, service_mode_text: response.data[0].service_mode_text, logo_url: response.data[0].logo_url });
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {serviceMode ? (
                <MaintenanceMode serviceModeText={footerInfo?.service_mode_text} />
            ) : (
                <>
                    {!pathName.includes('/courses/') && <HeaderBlock />}
                    <div style={{ flex: 1 }}>{children}</div> {/* Контент занимает оставшееся пространство */}
                    {!pathName.includes('/courses/') && (
                        <footer className="bg-gray-800 text-white py-6 mt-6">
                            <div className="container mx-auto px-4">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                                        <div className="flex items-center">
                                            {footerInfo?.logo_url && (
                                                <img
                                                    src={`${nextConfig.env?.API_URL}${footerInfo?.logo_url}`}
                                                    alt="Логотип"
                                                    className="h-10 mr-4"
                                                />
                                            )}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-2">О проекте</h4>
                                                <p>{footerInfo?.subscription_platform}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                                        <h4 className="text-lg font-semibold mb-2">Контакты</h4>
                                        <p>
                                            Email:{' '}
                                            <Link type='mail' href={`mailto:${footerInfo?.support_email}`}>
                                                {footerInfo?.support_email}
                                            </Link>
                                        </p>
                                    </div>

                                    <div className="w-full sm:w-1/3">
                                        <h4 className="text-lg font-semibold mb-2">Мы в соцсетях</h4>
                                        <ul className="flex space-x-4">
                                            <li>
                                                <a
                                                    href="https://facebook.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-gray-400"
                                                >
                                                    Facebook
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://twitter.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-gray-400"
                                                >
                                                    Twitter
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://instagram.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-gray-400"
                                                >
                                                    Instagram
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 text-center border-t border-gray-700 pt-4">
                                    <p>
                                        &copy; {new Date().getFullYear()} Проект {footerInfo?.platform_name}. Все права защищены.
                                    </p>
                                </div>
                            </div>
                        </footer>
                    )}
                </>
            )}
        </div>
    );
};

export default observer(Layout);
