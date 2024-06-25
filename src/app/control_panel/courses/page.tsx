"use client"
import {observer} from "mobx-react";
import {Button, Form, Input, Modal, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import {Post} from "@/stores/PostStore";
import Image from "next/image";
import {convertTimeFromStringToDate} from "@/app/constans";
import courseStore from "@/stores/CourseStore";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";

const columns: TableColumnsType = [
    {
        title: 'Картинка',
        dataIndex: 'image',
        key: 'image',
        width: '20%',
        render: (value:any,record:Post) => {
            return <Image src={`http://localhost:5000${record.image}`} width={200} height={200} alt={record.name}/>
        }
    },
    {
        title: 'Заголовок',
        dataIndex: 'name',
        width: '20%',
        key: 'name',
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
const CoursesPage = () => {

    const {courseStore} = useMobxStores()

    useEffect(() => {
       courseStore.getUserCourse().then(() => {
           courseStore.setLoadingCourses(false)
       });
    },[])
    return(
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <div>
                    <Link href="courses/add">
                        <Button className="mb-5" type="primary">Добавить курс</Button>
                    </Link>
                </div>
                <Table dataSource={courseStore.teacherCourses} columns={columns}/>
            </div>
        </div>
    )
}

export default observer(CoursesPage)