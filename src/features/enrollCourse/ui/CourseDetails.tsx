"use client"
import React, {useState} from "react";
import {Divider, Input, Modal, Rate} from "antd";
import Image from "next/image"
import {useRouter} from "next/navigation";
import {getCookieUserDetails} from "@/lib/users";
import {observer} from "mobx-react";
import nextConfig from "next.config.mjs";
import {AccessRightEnum} from "@/shared/api/course/model";
import {CourseAccessComponent, CourseLevelComponent} from "@/entities/course/ui";
import {useMobxStores} from "@/shared/store/RootStore";

const CourseDetails = () => {
    const [inputSecretKeyModal, setInputSecretKeyModal] = useState<boolean>(false)
    const router = useRouter();
    const { userStore, courseStore } = useMobxStores();

    // @ts-ignore
    // @ts-ignore
    return <>
        <Modal
            open={courseStore.openCourseDetailsModal}
            okText="Подтвердить"
            cancelText="Отменить"
            title="Введите секретный ключ"
            onCancel={() => courseStore.setOpenCourseDetailsModal(false)}
        >
            <div className="mt-6 mb-6">
                <Input.OTP mask="*" length={8} />
            </div>
        </Modal>

        <Modal
            open={courseStore.openCourseDetailsModal}
            okText={courseStore.selectedCourseForDetailModal && courseStore.selectedCourseForDetailModal.courseUsers && courseStore.selectedCourseForDetailModal.courseUsers.length > 0 ? "Продолжить" : "Начать"}
            cancelText="Закрыть"
            width="60%"
            confirmLoading={courseStore.loadingSubscribeCourse}
            onOk={() => {
                if (courseStore.selectedCourseForDetailModal && courseStore.selectedCourseForDetailModal.access_right === AccessRightEnum.PRIVATE) {
                    setInputSecretKeyModal(true);
                } else {
                    if (courseStore.selectedCourseForDetailModal && courseStore.selectedCourseForDetailModal.courseUsers && courseStore.selectedCourseForDetailModal.courseUsers.length > 0) {
                        courseStore.setOpenCourseDetailsModal(false)
                        router.push(`/platform/courses/${courseStore.selectedCourseForDetailModal.id}`);
                        return;
                    }
                    const currentUser = getCookieUserDetails();
                    if (!currentUser) {
                        userStore.setOpenLoginModal(true);
                        return;
                    }
                    courseStore.subscribeCourse(courseStore.selectedCourseForDetailModal!.id, currentUser.user.id).then(() => {
                        courseStore.setOpenCourseDetailsModal(false)
                        router.push(`/platform/courses/${courseStore.selectedCourseForDetailModal!.id}`);
                    })

                }
            }}
            onCancel={() => courseStore.setOpenCourseDetailsModal(false)}
        >
            <div className="flex justify-between mt-6">
                <div className="flex flex-col w-3/4">
                    <div className="flex items-center">
                        <h1 className="font-bold text-2xl">{courseStore.selectedCourseForDetailModal && courseStore.selectedCourseForDetailModal.name}</h1>
                        <div className="ml-2"><Rate disabled allowHalf defaultValue={2.5} /></div>
                    </div>
                    <h1 className="mt-2 text-lg">{courseStore.selectedCourseForDetailModal && courseStore.selectedCourseForDetailModal.small_description}</h1>
                </div>
                <div className="w-1/4 ml-6 flex justify-center">
                    <img
                        src={`${nextConfig.env!.API_URL}${courseStore.selectedCourseForDetailModal?.image}`}
                        alt="image" width={130} height={130} />
                </div>
            </div>
            <div className="flex items-center">
                <CourseLevelComponent level={courseStore.selectedCourseForDetailModal ? courseStore.selectedCourseForDetailModal.level :  AccessRightEnum.PRIVATE} />
                <div className="flex items-center ml-2">
                    <Image
                        className="mr-2"
                        src="/static/time_icon.svg"
                        alt="Время прохождения"
                        width={50} height={50} />
                    {courseStore.selectedCourseForDetailModal && <span className="ml-2">Время прохождения <br /> {courseStore.selectedCourseForDetailModal.duration} ч.</span>}
                </div>
                <div className="flex items-center ml-2">
                    <Image
                        className="mr-2"
                        src="/static/category_icon.svg"
                        alt="Категория"
                        width={50} height={50} />
                    {courseStore.selectedCourseForDetailModal && <p className="ml-2">Категория: <br /> {courseStore.selectedCourseForDetailModal.category?.name}</p>}
                </div>
                <CourseAccessComponent access_level={courseStore.selectedCourseForDetailModal ? courseStore.selectedCourseForDetailModal!.access_right : AccessRightEnum.PRIVATE} />
            </div>
            <Divider />
            <h2>Описание курса</h2>
            <div dangerouslySetInnerHTML={{ __html: courseStore.selectedCourseForDetailModal ? courseStore.selectedCourseForDetailModal!.content_description : "" }}></div>
        </Modal>
    </>
}

export default observer(CourseDetails);