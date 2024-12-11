import { Button, Card, Input, List } from "antd"
import { useState } from "react";

const { TextArea } = Input;

type CommentsBlockProps = {
    comments: any;
    handleCommentSubmit: (comment: string) => void
}

export const CommentsBlock = ({ comments, handleCommentSubmit }: CommentsBlockProps) => {
    const [comment, setComment] = useState<string>("");

    const handleCommentAdd = () => {
        handleCommentSubmit(comment)
    }
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Комментарии</h2>
            <Card>
                <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(item:any) => (
                        <li>
                            {item.author} {item.content}
                        </li>
                    )}
                />
            </Card>

            <Card className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Добавить комментарий</h3>
                <TextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Напишите ваш комментарий здесь..."
                />
                <div className="flex justify-end mt-2">
                    <Button
                        type="primary"
                        onClick={handleCommentAdd}
                        disabled={!comment.trim()}
                    >
                        Отправить
                    </Button>
                </div>
            </Card>
        </div>
    )
}