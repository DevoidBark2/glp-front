"use client"
import React, {useEffect, useRef, useState} from "react";
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import {Button, Drawer, FloatButton} from "antd";
import {CommentOutlined, CustomerServiceOutlined, QuestionCircleOutlined} from "@ant-design/icons";

const GraphPage = () => {

    const { settingsStore,graphStore } = useMobxStores()
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

        context.beginPath();
        context.moveTo(25, 25);
        context.lineTo(105, 25);
        context.lineTo(25, 105);
        context.fill();

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
            context.fillStyle = settingsStore.userSettings?.vertex_color
            context.fill()
        }
    }

    useEffect(() => {
        settingsStore.getUserSettings?.();
    },[])

    return(
        <div className="flex relative">
            <Button type="primary" onClick={() => graphStore.setVisibleMenu(true)} className="top-3 left-3" style={{position: "absolute"}}>Открыть меню</Button>
            <Drawer title="Свойства и алгоритмы" onClose={() => graphStore.setVisibleMenu(false)} open={graphStore.visibleMenu} placement="left">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <canvas className="canvas" ref={canvasRef} width={1000} height={800}  onClick={drawCircle} />
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ right: 24 }}
                icon={<QuestionCircleOutlined  />}
            >
                <FloatButton />
                <FloatButton icon={<CommentOutlined />} />
            </FloatButton.Group>
        </div>
    )
}

export default observer(GraphPage);