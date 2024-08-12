"use client"
import {Breadcrumb, Button, Col, Flex, Form, message, notification, Row, Select, Steps, UploadProps} from "antd";
import {useMobxStores} from "@/stores/stores";
import {Input} from "antd/lib";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {observer} from "mobx-react";
import Link from "next/link";

const SectionAddPage = () => {

    const {courseStore} = useMobxStores();
    const [createCourseForm] = Form.useForm();
    const router = useRouter();

    const steps = [
        {
            title: 'First',
            content: 'First-content',
        },
        {
            title: 'Second',
            content: 'Second-content',
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const [current, setCurrent] = useState(0);

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    return(
        <div className="bg-white h-full p-5 overflow-y-auto overflow-x-hidden">
            <Breadcrumb items={[ {
                title: <Link href={"/control_panel/sections"}>Разделы</Link>,
            },{
                title: <p>Новый раздел</p>,
            }]}/>
            <h1 className="text-center text-3xl">Добавление раздела</h1>

            <Steps current={current} items={items} />
            <div>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </div>
    );
}

export default observer(SectionAddPage);