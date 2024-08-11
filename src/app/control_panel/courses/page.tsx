"use client"
import {observer} from "mobx-react";
import {Button, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";
import {Course} from "@/stores/CourseStore";
import {convertTimeFromStringToDate} from "@/app/constans";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
const CoursesPage = () => {
    const {courseStore} = useMobxStores()

    const showCourseStatus = (course: Course) => {
        switch (course.status) {
            case StatusCourseEnum.NEW:
                return "Новый"
            case StatusCourseEnum.ACTIVE:
                return "Активный"
            case StatusCourseEnum.CLOSED:
                return "Закрытый"
            case StatusCourseEnum.IN_PROCESSING:
                return "В обработке"
        }
    }

    const columns: TableColumnsType<Course> = [
        {
            title: 'Название',
            dataIndex: 'name',
        },
        {
            title: 'Дата публикации',
            dataIndex: 'publish_date',
            sorter: (a,b) => {
                return convertTimeFromStringToDate(a.publish_date) - convertTimeFromStringToDate(b.publish_date)
            }
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (_,record) => showCourseStatus(record)
        },
        {
            title: "Действия",
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

    useEffect(() => {
       courseStore.getCoursesForCreator()
    },[])

    return(
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl mb-2">Доступные курсы</h1>
                    <div>
                        <Link href={"courses/add"}>
                            <Button type="primary">Добавить курс</Button>
                        </Link>
                    </div>
                </div>
                <Table dataSource={courseStore.teacherCourses} columns={columns} loading={courseStore.loadingCourses}/>
            </div>
        </div>
    )
}

export default observer(CoursesPage)