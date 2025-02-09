import { Button } from "antd"
import { useRouter } from "next/navigation"

export const HeaderNavigation = () => {
    const router = useRouter()

    return (
        <Button type="primary" className="absolute top-3 left-3" onClick={() => router.push('/platform/')}>Вернуться на платформу</Button>
    )
}