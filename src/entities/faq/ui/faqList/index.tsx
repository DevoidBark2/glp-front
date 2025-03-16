import { Collapse } from "antd";
import { observer } from "mobx-react";
import Image from "next/image";

import { useMobxStores } from "@/shared/store/RootStore";

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
            className="w-full rounded-lg overflow-hidden"
            items={faqStore.faqs.map((faq) => ({
                key: faq.id.toString(),
                label: <p className="break-all">{faq.question}</p>,
                children: <p className="text-gray-700 mt-2 leading-relaxed break-all">{faq.answer}</p>
            }))}
        />
    );
});
