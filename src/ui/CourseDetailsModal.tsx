"use client"
import React, {useState} from "react";
import {Divider, Input, Modal, Rate} from "antd";
import Image from "next/image"
import {CourseDetailsModalProps} from "@/interfaces/CourseDetailsModalProps";
import CourseLevelComponent from "@/components/CourseLevelComponent/CourseLevelComponent";
import CourseAccessComponent from "@/components/CourseAccessComponent/CourseAccessComponent";
import {AccessRightEnum} from "@/enums/AccessCourseEnum";
import {useRouter} from "next/navigation";
import {getCookieUserDetails} from "@/lib/users";
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({course,openModal,setOpenModal}) => {
    const [inputSecretKeyModal,setInputSecretKeyModal] = useState<boolean>(false)
    const router = useRouter();
    const {userStore} = useMobxStores();

    return <>
        <Modal
            open={inputSecretKeyModal}
            okText="Подтвердить"
            cancelText="Отменить"
            title="Введите секретный ключ"
            onCancel={() => setInputSecretKeyModal(false)}
        >
           <div className="mt-6 mb-6">
               <Input.OTP mask="*" length={8}/>
           </div>
        </Modal>

        <Modal
            open={openModal}
            okText="Начать"
            cancelText="Закрыть"
            width="60%"
            onOk={() => {
                if (course && course.access_right === AccessRightEnum.PRIVATE) {
                    setInputSecretKeyModal(true);
                } else {
                    const currentUser = getCookieUserDetails();
                    if (!currentUser) {
                        userStore.setOpenLoginModal(true);
                        return;
                    }
                    router.push(`/platform/courses/${course.id}`);
                }
            }}
            onCancel={() => setOpenModal(false)}
        >
            <div className="flex justify-between mt-6">
                <div className="flex flex-col w-3/4">
                   <div className="flex items-center">
                       <h1 className="font-bold text-2xl">{course && course.name}</h1>
                       <div className="ml-2"><Rate disabled allowHalf defaultValue={2.5} /></div>
                   </div>
                    <h1 className="mt-2 text-lg">{course && course.small_description}</h1>
                </div>
                <div className="w-1/4 ml-6 flex justify-center">
                    <img
                        src="https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png"
                        alt="image" width={130} height={130}/>
                </div>
            </div>
            <div className="flex items-center">
                <CourseLevelComponent level={course && course.level}/>
                <div className="flex items-center ml-2">
                    <Image
                        className="mr-2"
                        src="/static/time_icon.svg"
                        alt="Время прохождения"
                        width={50} height={50}/>
                    {course && <span className="ml-2">Время прохождения <br/> {course.duration} ч.</span>}
                </div>
                <div className="flex items-center ml-2">
                    <Image
                        className="mr-2"
                        src="/static/category_icon.svg"
                        alt="Категория"
                        width={50} height={50}/>
                    {course && <p className="ml-2">Категория: <br/> {course.category.name}</p>}
                </div>
                <CourseAccessComponent access_level={course && course.access_right}/>
            </div>
            <Divider/>
            <h2>Описание курса</h2>
            <div dangerouslySetInnerHTML={{__html: course && course.content_description}}></div>
        </Modal>
    </>
}

export default observer(CourseDetailsModal);