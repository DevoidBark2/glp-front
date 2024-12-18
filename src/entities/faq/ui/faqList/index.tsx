import { Faq } from "@/shared/api/faq/model";
import { Collapse } from "antd";
import { FC } from "react";

const { Panel } = Collapse;

interface FaqListProps {
    faqs: Faq[];
}

export const FaqList: FC<FaqListProps> = ({ faqs }) => (
    <Collapse
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
    </Collapse>
);
