import React from "react";
import Image from "next/image"
import Link from "next/link"

import { useMobxStores } from "@/shared/store/RootStore"

export const LinksAttachment = () => {
    const { courseStore } = useMobxStores()

    return (
        courseStore.sectionCourse?.links && courseStore.sectionCourse?.links.length > 0 && <div className="mt-6">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-900">🔗 Полезные ссылки</h2>
            <div className="space-y-4">
                {(courseStore.sectionCourse?.links || []).map((link, index) => (
                    <div
                        key={index}
                        className="flex items-center p-4 bg-gradient-to-b from-white to-green-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Image src="/static/browser-icon.svg" alt="Browser" width={30} height={30} />
                        <Link
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 text-blue-700 font-medium text-base hover:text-blue-500 transition-colors truncate"
                        >
                            {link}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}