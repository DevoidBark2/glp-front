import {observer} from "mobx-react";
import {AuthMethodEnum} from "@/shared/api/auth/model";
import Image from "next/image";
import nextConfig from "../../../../../next.config.mjs";
import dayjs from "dayjs";
import {UserRole} from "@/shared/api/user/model";
import {Button} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import React, {FC} from "react";
import {Comment} from "@/shared/api/comments/model";
import {useMobxStores} from "@/shared/store/RootStore";

interface CourseSectionCommentProps {
    comment: Comment
}

export const CourseSectionComment: FC<CourseSectionCommentProps> = observer(({comment}) => {
    const {userProfileStore, commentsStore} = useMobxStores();

    const deleteComment = (id: string) => {
        commentsStore.deleteSectionComment(id)
    }

    return (
        <div key={comment.id} className="relative flex items-start space-x-4">
            <div
                className={`w-10 h-10 ${userProfileStore.userProfile?.id === comment.user.id ? 'bg-green-400' : 'bg-blue-400'} rounded-full text-white flex items-center justify-center font-bold overflow-hidden`}>
                {comment.user.profile_url
                    ? comment.user.method_auth === AuthMethodEnum.GOOGLE || comment.user.method_auth === AuthMethodEnum.YANDEX
                        ? <Image src={comment.user.profile_url} width={20} height={20}
                                 alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                 className="w-full h-full object-cover"/>
                        : <Image src={`${nextConfig.env!.API_URL}${comment.user.profile_url}`} width={20} height={20}
                                 alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                 className="w-full h-full object-cover"/>
                    : userProfileStore.userProfile?.id === comment.user.id
                        ? 'Вы'
                        : `${comment.user.first_name[0]}${comment.user.second_name ? comment.user.second_name[0] : ""}`}

            </div>

            <div
                className={`flex-1 p-4 rounded-lg shadow-sm ${userProfileStore.userProfile?.id === comment.user.id ? 'bg-green-100' : 'bg-white'}`}>
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800">
                        {userProfileStore.userProfile?.id === comment.user.id
                            ? 'Вы'
                            : `${comment.user.first_name ?? ''} ${comment.user.second_name ?? ''}`}
                    </h4>
                    <span className="text-sm text-gray-500">{dayjs(comment.createdAt).fromNow()}</span>
                </div>
                <p className="text-gray-700 mt-2 break-words">{comment.text}</p>
            </div>

            {
                (userProfileStore.userProfile?.id === comment.user.id || userProfileStore.userProfile?.role === UserRole.SUPER_ADMIN) &&
                <div className="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 transition">
                    <Button onClick={() => deleteComment(comment.id)} danger icon={<DeleteOutlined/>}/>
                </div>
            }
        </div>
    )
})