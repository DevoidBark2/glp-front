import { Faq } from "@/shared/api/faq/model";
import { Collapse } from "antd";
import { FC } from "react";

const { Panel } = Collapse;

export const FaqList: FC<{ faqs: Faq[] }> = ({ faqs }) => (
    <Collapse
        accordion
        className="bg-white w-full rounded-lg shadow-lg overflow-hidden"
        bordered={false}
        expandIconPosition="end"
    >
        {faqs.map((faq) => (
            <Panel
                header={
                    <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition duration-200">
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
