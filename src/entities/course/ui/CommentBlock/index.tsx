import { observer } from "mobx-react";
import React from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSearchParams } from "next/navigation";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import Image from "next/image";
import nextConfig from "../../../../../next.config.mjs";
import { DeleteOutlined } from "@ant-design/icons";
import { UserRole } from "@/shared/api/user/model";
import { AuthMethodEnum } from "@/shared/api/auth/model";

dayjs.extend(relativeTime);
dayjs.locale('ru');

export const CommentBlock = observer(() => {
    const { commentsStore, userProfileStore } = useMobxStores()
    const searchParams = useSearchParams();

    const sendComment = () => {
        if (!searchParams.get("step")) return;

        if (commentsStore.comment.length < 1) {
            message.warning("Введите текст комментария!")
            return
        }
        commentsStore.sendSectionComment(Number(searchParams.get("step")))
    }

    const deleteComment = (id: string) => {
        if (searchParams.get("step")) {
            commentsStore.deleteSectionComment(id)
        }
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Комментарии</h3>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <TextArea
                    value={commentsStore.comment}
                    onChange={(e) => commentsStore.setComment(e.target.value)}
                    className="w-full h-24 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Напишите комментарий..."
                ></TextArea>
                <div className="flex justify-end mt-2">
                    <Button type="primary" onClick={sendComment}>
                        Отправить
                    </Button>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {commentsStore.sectionComments.length > 0 ? (
                    commentsStore.sectionComments.map((comment, index) => (
                        <div key={comment.id} className="relative flex items-start space-x-4">
                            <div
                                className={`w-10 h-10 ${userProfileStore.userProfile?.id === comment.user.id ? 'bg-green-400' : 'bg-blue-400'} rounded-full text-white flex items-center justify-center font-bold overflow-hidden`}>
                                {comment.user.profile_url
                                    ? comment.user.method_auth === AuthMethodEnum.GOOGLE || comment.user.method_auth === AuthMethodEnum.YANDEX
                                        ? <Image src={comment.user.profile_url} width={20} height={20}
                                            alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                            className="w-full h-full object-cover" />
                                        : <Image src={`${nextConfig.env!.API_URL}${comment.user.profile_url}`} width={20} height={20}
                                            alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                            className="w-full h-full object-cover" />
                                    : userProfileStore.userProfile?.id === comment.user.id
                                        ? 'Вы'
                                        : `${comment.user.first_name[0]}${comment.user.second_name ? comment.user.second_name[0] : ""}`}

                            </div>

                            <div className={`flex-1 p-4 rounded-lg shadow-sm ${userProfileStore.userProfile?.id === comment.user.id ? 'bg-green-100' : 'bg-white'}`}>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800">
                                        {userProfileStore.userProfile?.id === comment.user.id
                                            ? 'Вы'
                                            : `${comment.user.first_name ?? ''} ${comment.user.second_name ?? ''}`}
                                    </h4>
                                    <span className="text-sm text-gray-500">{dayjs(comment.createdAt).fromNow()}</span>
                                </div>
                                <p className="text-gray-700 mt-2">{comment.text}</p>
                            </div>

                            {
                                (userProfileStore.userProfile?.id === comment.user.id || userProfileStore.userProfile?.role === UserRole.SUPER_ADMIN) &&
                                <div className="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 transition">
                                    <Button onClick={() => deleteComment(comment.id)} danger icon={<DeleteOutlined />} />
                                </div>
                            }
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <h3 className="text-lg font-semibold text-gray-700">Комментариев пока нет</h3>
                        <p className="text-sm text-gray-500 mt-2">Будьте первым, кто оставит комментарий!</p>
                    </div>
                )}
            </div>
        </div>
    )
})