"use client"
import Image from "next/image"
import {Button, Divider, Form, Input, Modal, Progress, Skeleton} from "antd";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect, useState} from "react";

const ProfilePage = () => {

    const {userStore} = useMobxStores()
    const [form] = Form.useForm();
    const [userCourses,setUserCourses] = useState([
        {id:1,name: "Курс по HTTP",image: "https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png",},
        {id:1,name: "Курс по Java",image: "https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png",}
    ])

    useEffect(() => {
        userStore.getUserProfile?.().then(() => {
            form.setFieldsValue(userStore.userProfileDetails)
        });
    },[])

    return (
        !userStore.loading ? <div className="container mx-auto">

            <Modal
                open={userStore.openLeaveCourseModal}
                onCancel={() => userStore.setOpenLeaveCourseModal(false)}
            >
                Вы точно хотите покинуть курс?
            </Modal>

            <h1 className="text-4xl my-5">Профиль пользователя</h1>
            <div className="flex">
                <div className="w-2/5 bg-[#f5f5f5] flex flex-col rounded-md shadow-md p-4">
                    <div className="flex justify-center">
                        <Image className="rounded" src="/static/profile_photo.jpg" alt="Картинка профиля" width={200} height={200}/>
                    </div>
                    <div className="p-6">
                        <Form
                            form={form}
                        >
                            <Form.Item
                                name="first_name"
                            >
                                <Input className="h-12" placeholder="Введите имя"/>
                            </Form.Item>
                            <Form.Item
                                name="second_name"
                            >
                                <Input className="h-12" placeholder="Введите фамилию"/>
                            </Form.Item>

                            <div className="flex flex-col items-center">
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить</Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="w-3/5 bg-[#f5f5f5] ml-6 flex flex-col rounded-md shadow-md p-4">
                    <h1 className="text-2xl">Ваши курсы</h1>
                    <Divider/>
                    {
                        userCourses.map(course => (
                            <div key={course.id} className="p-2 bg-white mt-2 rounded">
                                <Progress percent={35} type="line" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div>
                                            <img src="https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png" alt={course.name} width={50} height={50}/>
                                        </div>
                                        <h1>{course.name}</h1>
                                    </div>
                                    <div className="flex items-center">
                                        <Button type="primary">Продолжить</Button>
                                        <Button
                                            danger
                                            type="primary"
                                            className="ml-2"
                                            onClick={() => userStore.setOpenLeaveCourseModal(true)}
                                        >Покинуть курс</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/*<div className="bg-[#f5f5f5] max-w-full p-5 rounded border flex relative">*/}

            {/*    <Image src="/static/profile_icon.svg" width={200} height={200} alt="Фото профиля"/>*/}
            {/*    <div className="flex justify-between">*/}
            {/*        <Input value={userStore.userProfileDetails?.first_name} disabled className="h-10"/>*/}
            {/*        <Input value={userStore.userProfileDetails?.second_name} disabled className="h-10"/>*/}
            {/*        <Input value={userStore.userProfileDetails?.last_name} disabled className="h-10"/>*/}
            {/*    </div>*/}

            {/*    <Image*/}
            {/*        src="/static/edit_profile_icon.svg"*/}
            {/*        alt="Изменить данные"*/}
            {/*        width={40}*/}
            {/*        height={40}*/}
            {/*        className="absolute right-5 top-5 cursor-pointer"*/}
            {/*        onClick={() => userStore.setUserEditModal(true)}*/}
            {/*    />*/}
            {/*</div>*/}
        </div> : <Skeleton active/>
    )
}

export default observer(ProfilePage);