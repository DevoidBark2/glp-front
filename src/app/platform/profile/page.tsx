"use client"
import Image from "next/image"
import {Form, Input, Modal, Skeleton} from "antd";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {useEffect} from "react";
const ProfilePage = () => {

    const {userStore} = useMobxStores()

    useEffect(() => {
        userStore.getUserProfile().finally(() => {
            userStore.setLoading(false)
        });
    },[])

    return (
        !userStore.loading ? <div className="container mx-auto">

            <Modal
                open={userStore.userEditModal}
                onCancel={() => userStore.setUserEditModal(false)}
                title="Редактирование профиля"
            >
                <Form
                    initialValues={userStore.userProfileDetails && {
                        first_name: userStore.userProfileDetails.first_name,
                        last_name: userStore.userProfileDetails.last_name,
                        // add more properties as needed
                    } || {}}
                >
                    <Form.Item
                        label="Имя"
                        name="first_name"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>

            <h1 className="text-4xl my-5">Ваш профиль</h1>
            <div className="bg-[#f5f5f5] max-w-full p-5 rounded border flex relative">

                <Image src="/static/profile_icon.svg" width={200} height={200} alt="Фото профиля"/>
                <div className="flex justify-between">
                    <Input value={userStore.userProfileDetails?.first_name} disabled className="h-10"/>
                    <Input value={userStore.userProfileDetails?.second_name} disabled className="h-10"/>
                    <Input value={userStore.userProfileDetails?.last_name} disabled className="h-10"/>
                </div>

                <Image
                    src="/static/edit_profile_icon.svg"
                    alt="Изменить данные"
                    width={40}
                    height={40}
                    className="absolute right-5 top-5 cursor-pointer"
                    onClick={() => userStore.setUserEditModal(true)}
                />
            </div>
        </div> : <Skeleton active/>
    )
}

export default observer(ProfilePage);