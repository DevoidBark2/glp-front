"use client"
import {observer} from "mobx-react";
import {Button, Divider, Modal, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";
import {Course} from "@/stores/CourseStore";
import {convertTimeFromStringToDate} from "@/app/constans";
import {FILTER_STATUS_COURSE} from "@/constants";
import {showCourseStatus} from "@/utils/showCourseStatusInTable";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
const CoursesPage = () => {
    const {courseStore} = useMobxStores()

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
            filters: FILTER_STATUS_COURSE,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (_,record) => showCourseStatus(record)
        },
        {
            title: "Действия",
            align: 'end' as const,
            render: (_:any, record) => (
                <div className="flex justify-end">
                    {record.status === StatusCourseEnum.NEW && <Button onClick={() => courseStore.publishCourse(record.id)} type="default">Опубликовать</Button>}
                    <Button className="ml-2" type="default"><Link href={`courses/${record.id}`}>
                        Изменить
                    </Link></Button>
                    <Button className="ml-2" onClick={() => courseStore.setShowConfirmDeleteCourseModal(true)}
                            danger type="primary">
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
        <>
            <Modal
                open={courseStore.showConfirmDeleteCourseModal}
                onCancel={() => courseStore.setShowConfirmDeleteCourseModal(false)}
                title="Удаление курса"
            >
               <h1 className="text-xl"> Вы уверены, что хотите удалить курс?</h1>
            </Modal>
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
                    <Divider/>
                    <Table dataSource={courseStore.teacherCourses} columns={columns}
                           loading={courseStore.loadingCourses}/>
                </div>
            </div>
        </>
    )
}

export default observer(CoursesPage)