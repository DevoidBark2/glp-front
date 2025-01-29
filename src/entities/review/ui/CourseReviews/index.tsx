import { Avatar, Divider, List, Rate } from "antd"
import { UserOutlined } from "@ant-design/icons";

export const CourseReviews = () => {

    const mockReviews = [
        {
            id: 1,
            user: {
                first_name: "Иван",
                last_name: "Петров",
                profile_url: "",
            },
            rating: 5,
            comment: "Отличный курс! Всё понятно и интересно объяснено.",
        },
        {
            id: 2,
            user: {
                first_name: "Мария",
                last_name: "Сидорова",
                profile_url: "",
            },
            rating: 4,
            comment: "Хороший курс, но хотелось бы больше примеров.",
        },
        {
            id: 3,
            user: {
                first_name: "Алексей",
                last_name: "Кузнецов",
                profile_url: "",
            },
            rating: 3.5,
            comment: "Неплохо, но есть где улучшить подачу материала.",
        },
    ];


    const averageRating = mockReviews.length
        ? mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length
        : 0;


    return (
        <div>
            <div className="flex items-center space-x-4 mt-6">
                <Rate allowHalf disabled value={averageRating} />
                <span className="text-gray-700 text-lg">
                    {averageRating ? `${averageRating.toFixed(1)} / 5` : "Нет оценок"}
                </span>
                <span className="text-gray-500 text-sm">({mockReviews.length} отзывов)</span>
            </div>

            <Divider />

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Отзывы пользователей</h2>

            {mockReviews.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={mockReviews}
                    renderItem={(review) => (
                        <List.Item className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={review.user.profile_url || undefined}
                                        icon={!review.user.profile_url && <UserOutlined />}
                                        size="large"
                                    />
                                }
                                title={
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-900">
                                            {review.user.first_name} {review.user.last_name}
                                        </span>
                                        <Rate disabled value={review.rating} />
                                    </div>
                                }
                                description={<p className="text-gray-700">{review.comment}</p>}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <p className="text-gray-500">Пока нет отзывов.</p>
            )}
        </div>
    )
}