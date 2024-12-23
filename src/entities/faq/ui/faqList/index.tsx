import { Faq } from "@/shared/api/faq/model";
import { Collapse } from "antd";
import { FC } from "react";
import Image from "next/image";

const { Panel } = Collapse;

interface FaqListProps {
    faqs: Faq[];
}

export const FaqList: FC<FaqListProps> = ({ faqs }) => (
    faqs.length > 0 ? <Collapse
    accordion
    className="bg-white w-full rounded-lg shadow-lg overflow-hidden"
    bordered={false}
    expandIconPosition="end"
>
    {faqs.map((faq) => (
        <Panel
            header={
                <span className="text-lg font-semibold text-gray-800 hover:cursor-pointer">
                    {faq.question}
                </span>
            }
            key={faq.id}
            className="group border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        >
            <p className="text-gray-700 mt-4 leading-relaxed">{faq.answer}</p>
        </Panel>
    ))}
</Collapse> : <div className="text-center py-10 flex flex-col items-center">
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
