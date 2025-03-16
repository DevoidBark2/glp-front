import { observer } from "mobx-react";
import React from "react";
import { Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSearchParams } from "next/navigation";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from "dayjs";

import 'dayjs/locale/ru';
import { useTheme } from "next-themes";

import { CourseSectionComment } from "@/entities/comments/ui";
import { useMobxStores } from "@/shared/store/RootStore";

dayjs.extend(relativeTime);
dayjs.locale('ru');

export const CommentBlock = observer(() => {
    const { commentsStore, courseStore } = useMobxStores()
    const searchParams = useSearchParams();
    const { resolvedTheme } = useTheme()

    const sendComment = () => {
        if (!searchParams.get("step")) {return;}

        if (commentsStore.comment.length < 1) {
            message.warning("Введите текст комментария!")
            return
        }
        commentsStore.sendSectionComment(Number(searchParams.get("step")))
    }

    if (courseStore.messageWarning || Number(searchParams.get("step")) === -1) {
        return;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Комментарии</h3>
            <div className="p-4 rounded-lg shadow-sm">
                <TextArea
                    value={commentsStore.comment}
                    onChange={(e) => commentsStore.setComment(e.target.value)}
                    className="w-full h-24 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Напишите комментарий..."
                ></TextArea>
                <div className="flex justify-end mt-4">
                    <Button color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"} onClick={sendComment}>
                        Отправить
                    </Button>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {commentsStore.sectionComments.length > 0 ? (
                    commentsStore.sectionComments.map((comment, index) => (
                        <CourseSectionComment key={comment.id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center py-6">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Комментариев пока нет</h3>
                        <p className="text-sm text-gray-500 mt-2 dark:text-white">Будьте первым, кто оставит комментарий!</p>
                    </div>
                )}
            </div>
        </div>
    )
})