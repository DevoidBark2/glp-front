"use client";
import React, { useEffect, useState } from 'react';
import HeaderBlock from "../../components/Header/Header";
import MaintenanceMode from "@/components/MaintenanceModeComponent/MaintenanceModeComponent";
import { observer } from 'mobx-react';
import { useMobxStores } from '@/stores/stores';
import { Spin } from 'antd';
import Link from 'next/link';
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
            setServiceMode(response.data[0]?.service_mode);
            if (response.data[0]?.service_mode) {
                router.push('/platform');
            }
            setFooterInfo({ subscription_platform: response.data[0]?.subscription_platform, platform_name: response.data[0]?.platform_name, support_email: response.data[0]?.support_email, contact_phone: response.data[0]?.contact_phone, service_mode_text: response.data[0]?.service_mode_text, logo_url: response.data[0]?.logo_url });
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
                    {!pathName.includes('/lessons/') && <HeaderBlock />}
                    <div style={{ flex: 1 }}>{children}</div>
                    {!pathName.includes('/lessons/') && (
                        <footer className="bg-gray-800 text-white py-10 mt-10">
                            <div className="container mx-auto px-6">
                                <div className="flex flex-wrap sm:flex-nowrap justify-around items-start">

                                    <div className="w-full sm:w-1/3 mb-6 sm:mb-0 text-left">
                                        <h4 className="text-lg font-semibold mb-3">О проекте</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {footerInfo?.subscription_platform}
                                        </p>
                                    </div>

                                    <div className="w-full sm:w-1/3 mb-6 sm:mb-0 text-left sm:text-center">
                                        <h4 className="text-lg font-semibold mb-3">Контакты</h4>
                                        <p className="text-gray-300 text-sm">
                                            Email:
                                            <Link href={`mailto:${footerInfo?.support_email}`} className="hover:underline ml-1">
                                                {footerInfo?.support_email}
                                            </Link>
                                        </p>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Телефон:
                                            <Link href={`tel:${footerInfo?.contact_phone}`} className="hover:underline ml-1">
                                                <span className="ml-1">{footerInfo?.contact_phone || "+7 (000) 000-0000"}</span>
                                            </Link>
                                        </p>
                                    </div>

                                    <div className="w-full sm:w-1/3 text-left sm:text-center">
                                        <h4 className="text-lg font-semibold mb-3">Полезные ссылки</h4>
                                        <ul className="text-gray-300 text-sm space-y-2">
                                            <li>
                                                <Link href="/platform/faq" className="hover:underline">
                                                    Вопросы и ответы (FAQ)
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/platform/support" className="hover:underline">
                                                    Поддержка
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 text-center border-t border-gray-700 pt-4 text-gray-400 text-xs">
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
