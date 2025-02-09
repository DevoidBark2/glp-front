import { observer } from "mobx-react"
import Link from "next/link"


const AssetsBox = () => {


    return (
        <div></div>
    )
}

export const UI = observer(() => {
    return (
        <main className="pointer-events-none fixed z-10 inset-0 p-10">
            <div className="mx-auto h-full max-x-screen-xl w-full flex felx-col justify-between">
                <div className="flex justify-between items-center">
                    <Link href="/platform">Learnify</Link>
                </div>
                <div className="flex flex-col gap-6">
                    <AssetsBox />
                </div>
            </div>
        </main>
    )
})