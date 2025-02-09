"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

const Model = () => {
    const { scene } = useGLTF("/models/character.glb"); // Путь к модели

    // scene.traverse((child) => {
    //     if (child.isMesh) {
    //         child.castShadow = true;
    //         child.receiveShadow = true;
    //     }
    // });

    return <primitive object={scene} scale={1} />;
};

const ThreeDPage = () => {
    return (
        <div className="absolute inset-0 h-screen w-screen">
            <Canvas
                shadows
                camera={{
                    position: [2, 2, 2], // Камера подальше для лучшего обзора
                    fov: 50,
                }}
            >
                {/* Фоновый цвет */}
                <color attach="background" args={["#333"]} />

                {/* Свет */}
                <ambientLight intensity={0.5} /> {/* Мягкое окружение */}
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1}
                    castShadow
                />
                <spotLight
                    position={[2, 5, 2]}
                    intensity={1}
                    angle={0.3}
                    penumbra={1}
                    castShadow
                />

                {/* Пол (для тени) */}
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#444" />
                </mesh>

                <OrbitControls minDistance={1} maxDistance={5} />

                <Suspense fallback={null}>
                    <Model />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ThreeDPage;
