"use client"
import {useEffect, useRef, useState} from "react";
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";

const GraphPage = () => {

    const {settingsStore} = useMobxStores()
    const canvasRef = useRef(null)
    const [circleVisible, setCircleVisible] = useState(false)
    const [circleX, setCircleX] = useState(0)
    const [circleY, setCircleY] = useState(0)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        for (let i = 5; i < 500; i = i + 6) {
            context.moveTo(i,5);
            context.lineTo(i,500);

            context.moveTo(5,i);
            context.lineTo(500,i);

            context.strokeStyle = "#f0f0f0";
            context.stroke();
        }

        canvas.addEventListener('click', (event) => {
            setCircleVisible(true)
            const rect = canvas.getBoundingClientRect()
            setCircleX(event.clientX - rect.left)
            setCircleY(event.clientY - rect.top)
        })
    }, [])

    const drawCircle = (event) => {
        const canvas = event.target
        const context = canvas.getContext('2d')
        if (circleVisible) {
            context.beginPath()
            context.arc(circleX, circleY, 15, 0, 2 * Math.PI)
            context.fillStyle = settingsStore.userSettings.edge_color
            context.fill()
        }
    }

    useEffect(() => {
        settingsStore.getUserSettings?.();
    },[])

    return(
        <div className="flex">
            <canvas className="canvas" ref={canvasRef} width={500} height={500}  onClick={drawCircle} />
        </div>
    )
}

export default observer(GraphPage);