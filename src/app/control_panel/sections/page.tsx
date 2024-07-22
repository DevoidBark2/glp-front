"use client"
import {Button, Table, TableColumnsType} from "antd";
import React from "react";
import {convertTimeFromStringToDate} from "@/app/constans";
import Link from "next/link";

const columns: TableColumnsType = [
    {
        title: 'Заголовок',
        dataIndex: 'name',
        width: '20%',
        key: 'name',
    },
    {
        title: 'Курс',
        dataIndex: 'course_name',
        width: '20%',
        key: 'course_name',
    },
    {
        dataIndex: 'publish_date',
        key: 'publish_date',
        width: '20%',
        title: 'Дата публикации',
        sorter: (a: { publish_date: string }, b: { publish_date: string }) => {
            return convertTimeFromStringToDate(a.publish_date).getTime() - convertTimeFromStringToDate(b.publish_date).getTime();
        }
    },
    {
        title: "Действия",
        width: '20%',
        align: 'center' as const,
        render: (_:any, record:any) => (
            <div>
                <Button type="default">Изменить</Button>
                <Button danger type="primary" style={{marginLeft:'20px'}} >
                    Удалить
                </Button>
            </div>
        ),
    },

];
const SectionPage = () => {
    return(
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <Link href="sections/add"><Button className="mb-5" type="primary" onClick={() => {}}>Добавить раздел</Button></Link>
                <Table dataSource={[]} columns={columns}/>
            </div>
        </div>
    )
}

export default SectionPage;