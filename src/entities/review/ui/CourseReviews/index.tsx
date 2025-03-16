import { Avatar, Button, Divider, List, Rate } from "antd"
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import dayjs from "dayjs";

import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import nextConfig from "next.config.mjs";
import { IsAdmin } from "@/entities/user/selectors";

interface CourseReviewsProps {
    onDeleteComment: (id: number) => void
}

export const CourseReviews = observer(({ onDeleteComment }: CourseReviewsProps) => {
    const { reviewStore, userProfileStore } = useMobxStores()

    const averageRating = reviewStore.courseReviews.length
        ? reviewStore.courseReviews.reduce((acc, review) => acc + review.rating, 0) / reviewStore.courseReviews.length
        : 0;

    return (
        <div>
            <div className="flex items-center space-x-4 mt-6">
                <Rate allowHalf disabled value={averageRating} />
                <span className="text-gray-700 text-lg dark:text-white">
                    {averageRating ? `${averageRating.toFixed(1)} / 5` : "Нет оценок"}
                </span>
                <span className="text-gray-500 text-sm dark:text-white">({reviewStore.courseReviews.length} отзывов)</span>
            </div>

            <Divider />

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">Отзывы пользователей</h2>

            {reviewStore.courseReviews.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={reviewStore.courseReviews}
                    renderItem={(review) => (
                        <List.Item
                            className="bg-gray-50 px-4 rounded-lg shadow-sm mb-4 flex relative"
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        className="ml-3"
                                        src={
                                            review.user?.profile_url
                                                ? [AuthMethodEnum.GOOGLE, AuthMethodEnum.YANDEX].includes(review.user?.method_auth)
                                                    ? review.user?.profile_url
                                                    : `${nextConfig.env?.API_URL}${review.user?.profile_url}`
                                                : undefined
                                        }
                                        icon={!review.user?.profile_url && <UserOutlined />}
                                        size="large"
                                    />
                                }
                                title={
                                    <div className="flex items-center justify-between mr-3">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {review.user.second_name ?? ""} {review.user.first_name ?? ""} {review.user.last_name ?? ""}
                                        </span>
                                        <div>
                                            <Rate disabled allowHalf value={review.rating} />
                                            {
                                                (IsAdmin(userProfileStore.userProfile?.role!) || review.user.id === userProfileStore.userProfile?.id) && (
                                                    <Button
                                                        className="ml-3"
                                                        type="primary"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => onDeleteComment(review.id)}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                }
                                description={<p className="text-gray-700 break-words whitespace-normal">{review.review}</p>}
                            />
                            <span className="absolute right-2 bottom-2 text-gray-500 text-sm">
                                {dayjs(review.created_at).fromNow()}
                            </span>
                        </List.Item>

                    )}
                />
            ) : (
                <p className="text-gray-500 dark:text-white">Пока нет отзывов.</p>
            )}
        </div>
    )
})