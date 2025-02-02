import { Collapse } from "antd";
import { observer } from "mobx-react";
import Image from "next/image";
import { useMobxStores } from "@/shared/store/RootStore";
import { useState } from "react";

const { Panel } = Collapse;

export const FaqList = observer(() => {
    const { faqStore } = useMobxStores();

    if (!faqStore.faqs?.length) {
        return (
            <div className="text-center py-10 flex flex-col items-center">
                <Image
                    src="/static/empty-icon.svg"
                    alt="Empty"
                    width={150}
                    height={150}
                />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ответы не найдены</h2>
                <p className="text-gray-600">Не переживайте, контент скоро появится. Пожалуйста, вернитесь позже!</p>
            </div>
        );
    }

    return (
        <Collapse
            accordion
            className=" w-full rounded-lg overflow-hidden space-y-4" // Добавляем отступы между блоками
            bordered={false}
            expandIconPosition="end"
        >
            {faqStore.faqs.map((faq) => (
                <Panel
                    key={faq.id}
                    header={
                        <div className="text-lg font-semibold text-gray-800 cursor-pointer">
                            <span className="line-clamp-1 overflow-hidden text-ellipsis">{faq.question}</span>
                        </div>
                    }
                    className="group border border-gray-200 hover:bg-gray-50 transition-colors duration-200 rounded-lg mb-3"
                >
                    <p className="text-gray-700 mt-2 leading-relaxed">{faq.answer}</p>
                </Panel>
            ))}
        </Collapse>

    );
});
