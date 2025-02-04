import { useMobxStores } from "@/shared/store/RootStore"
import { Button, Collapse, Popconfirm, Progress, Tooltip } from "antd"
import { observer } from "mobx-react"
import { DeleteOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

export const CourseMembers = observer(() => {
    const { courseStore } = useMobxStores()

    return (
        <div style={{ padding: '20px 0', borderBottom: '1px solid #ddd', marginBottom: 10 }}>
            <h3 style={{ marginBottom: 15, fontWeight: 'bold', fontSize: '18px' }}>👥 Текущие участники</h3>
            {courseStore.courseMembers.length > 0 ? (
                <Collapse accordion>
                    {courseStore.courseMembers.map((item, index) => (
                        <Panel
                            header={
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">
                                        {item.user.first_name} {item.user.second_name || ''}
                                    </h4>
                                </div>
                            }
                            key={item.id}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Запись на курс: {new Date(item.enrolledAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Tooltip title="Удалить участника">
                                        <Popconfirm
                                            title="Удалить участиника?"
                                            placement="leftBottom"
                                            description="Вы уверены, что хотите удалить данного учестаника? Это действие нельзя будет отменить."
                                            okText="Да"
                                            // onConfirm={() => handleDeleteMember(item.id)}
                                            cancelText="Нет"
                                        >
                                            <Button
                                                danger
                                                type="primary"
                                                icon={<DeleteOutlined />}
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                </div>

                                <p className="text-gray-600">
                                    <strong>Прогресс:</strong>
                                </p>
                                <Progress percent={item.progress} status="active" />
                            </div>
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                <p className="italic text-gray-500">Нет участников вашего курса!</p>
            )}
        </div>
    )
})