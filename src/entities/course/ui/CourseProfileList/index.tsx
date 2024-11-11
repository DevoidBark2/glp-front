import { Button, Empty } from "antd";
import { CourseProfileItem } from "../CourseProfileItem";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";

export const CourseProfileList = observer(() => {
    const {userProfileStore} = useMobxStores();
    const router = useRouter();
    return (
        <div>
            {userProfileStore.userProfileCourses.length > 0 ?  userProfileStore.userProfileCourses.map(course => (
                    <CourseProfileItem course={course}/>
                )) : <div className="flex items-center justify-center h-3/4">
                    <Empty description={<div className="flex flex-col">
                        <span>Список пуст</span>
                        <Button type="primary" className="mt-2" onClick={() => router.push('/platform/courses')}>Перейти к списку</Button>
                    </div>} />
                </div>}
        </div>
    )
})