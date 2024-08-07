"use client"
import {observer} from "mobx-react";
import {Button, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import {convertTimeFromStringToDate} from "@/app/constans";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";
import {Course, TeacherCourse} from "@/stores/CourseStore";

const columns: TableColumnsType<Course> = [
    {
        title: 'Название',
        dataIndex: 'name',
        width: '20%',
    },
    {
      title: "Категория",
      dataIndex: "category"
    },
    {
        title: 'Дата публикации',
        dataIndex: 'publish_date',
        width: '20%',
        sorter: (a,b) => {
            return convertTimeFromStringToDate(a.publish_date).getTime() - convertTimeFromStringToDate(b.publish_date).getTime();
        }
    },
    {
        title: "Действия",
        width: '20%',
        align: 'center' as const,
        render: (_:any, record) => (
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
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl">Доступные курсы</h1>
                    <div>
                        <Link href="courses/add">
                            <Button className="mb-5" type="primary">Добавить курс</Button>
                        </Link>
                    </div>
                </div>
                <Table dataSource={courseStore.teacherCourses} columns={columns}/>
            </div>
        </div>
    )
}

export default observer(CoursesPage)