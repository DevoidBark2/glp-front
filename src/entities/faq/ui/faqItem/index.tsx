import { Faq } from '@/shared/api/faq/model';
import { Collapse } from 'antd';
import { FC } from 'react';

const { Panel } = Collapse;

export const FaqItem: FC<{ faq: Faq }> = ({ faq }) => (
    <Collapse className="faq-item" bordered={false} ghost>
        <Panel header={faq.question} key={faq.id}>
            <p>{faq.answer}</p>
        </Panel>
    </Collapse>
);

