import React from "react";
import Link from "next/link";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";

export const Footer = observer(({ userSettings }: { userSettings?: any }) => {
    const { generalSettingsStore } = useMobxStores();


    return (
        <footer className="bg-[#2a2a2a] text-white py-10 mt-10">
            {userSettings}
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap sm:flex-nowrap justify-around items-start gap-2">

                    <div className="w-full sm:w-1/3 mb-6 sm:mb-0 text-left">
                        <h4 className="text-lg font-semibold mb-3">О проекте</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {generalSettingsStore.generalSettings?.subscription_platform}
                        </p>
                    </div>

                    <div className="w-full sm:w-1/3 mb-6 sm:mb-0 text-left sm:text-center">
                        <h4 className="text-lg font-semibold mb-3">Контакты</h4>
                        <p className="text-gray-300 text-sm">
                            Email:
                            <Link href={`mailto:${generalSettingsStore.generalSettings?.support_email}`} className="hover:underline ml-1">
                                {generalSettingsStore.generalSettings?.support_email}
                            </Link>
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                            Телефон:
                            <Link href={`tel:${generalSettingsStore.generalSettings?.contact_phone}`} className="hover:underline ml-1">
                                <span className="ml-1">{generalSettingsStore.generalSettings?.contact_phone || "+7 (000) 000-0000"}</span>
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
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center border-t border-gray-700 pt-4 text-gray-400 text-xs">
                    <p>
                        &copy; {new Date().getFullYear()} Проект {generalSettingsStore.generalSettings?.platform_name}. Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    )
})