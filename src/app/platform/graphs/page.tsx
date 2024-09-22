"use client";
import React, {useEffect, useRef, useState} from "react";
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import {Button, Drawer, FloatButton, Menu} from "antd";
import {CommentOutlined, CustomerServiceOutlined, QuestionCircleOutlined} from "@ant-design/icons";

const GraphPage = () => {
    const { settingsStore, graphStore } = useMobxStores();
    const canvasRef = useRef(null);
    const [circleVisible, setCircleVisible] = useState(false);
    const [circleX, setCircleX] = useState(0);
    const [circleY, setCircleY] = useState(0);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.addEventListener('click', (event: any) => {
            setCircleVisible(true);
            const rect = canvas.getBoundingClientRect();
            setCircleX(event.clientX - rect.left);
            setCircleY(event.clientY - rect.top);
        });

        // Add event listener for right-click
        canvas.addEventListener('contextmenu', handleRightClick);

        return () => {
            canvas.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

    const handleRightClick = (event: any) => {
        event.preventDefault();
        const rect = canvasRef.current.getBoundingClientRect();
        setContextMenuPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
        setContextMenuVisible(true);
    };

    const handleMenuClick = (e: any) => {
        // Handle menu item clicks here
        console.log('Clicked menu item: ', e.key);
        setContextMenuVisible(false);
    };

    const drawCircle = (event: any) => {
        const canvas = event.target;
        const context = canvas.getContext('2d');
        if (circleVisible) {
            context.beginPath();
            context.arc(circleX, circleY, 15, 0, 2 * Math.PI);
            context.fillStyle = settingsStore.userSettings?.vertex_color;
            context.fill();
        }
    };


    useEffect(() => {
        settingsStore.getUserSettings?.();
    }, []);

    return (
        <div className="flex relative">
            <Button type="primary" onClick={() => graphStore.setVisibleMenu(true)} className="top-3 left-3" style={{ position: "absolute" }}>Открыть меню</Button>
            <Drawer title="Свойства и алгоритмы" onClose={() => graphStore.setVisibleMenu(false)} open={graphStore.visibleMenu} placement="left">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <canvas
                className="canvas"
                ref={canvasRef}
                onClick={drawCircle}
                width={window.innerWidth}
                height={window.innerHeight - 140}
                style={{ display: 'block' }}
            />
            {contextMenuVisible && (
                <Menu
                    onClick={handleMenuClick}
                    style={{
                        position: 'absolute',
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                        zIndex: 1000
                    }}
                    items={[
                        { key: '1', label: 'Добавить вершину' },
                        { key: '2', label: 'Удалить вершину' },
                        { key: '3', label: 'Свойства вершины' },
                    ]}
                />
            )}
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ right: 24 }}
                icon={<QuestionCircleOutlined />}
            >
                <FloatButton />
                <FloatButton icon={<CommentOutlined />} />
            </FloatButton.Group>
        </div>
    );
};

export default observer(GraphPage);
