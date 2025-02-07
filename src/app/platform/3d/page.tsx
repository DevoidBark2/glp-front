"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {BottomNavigation} from "@/widgets";

const ThreeDPage = () => {
    return (
        <div className="absolute inset-0 h-screen w-screen">
            <BottomNavigation/>
            <Canvas
                camera={{
                    position: [1.5, 1.5, 1.5], // Камера ближе к кубу
                    fov: 50, // Поле зрения
                }}
            >
                <color attach="background" args={["#333"]} />
                <OrbitControls
                    minDistance={1}
                    maxDistance={5}
                />
                <mesh>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshNormalMaterial />
                </mesh>
            </Canvas>
        </div>
    );
};

export default ThreeDPage;
