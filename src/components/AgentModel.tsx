import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Model = () => {
    // Load the GLB model from the public directory
    const { scene } = useGLTF('/agent.glb');
    const groupRef = useRef<THREE.Group>(null);
    const headBoneRef = useRef<THREE.Object3D | null>(null);
    const eyeBonesRef = useRef<THREE.Object3D[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Find the head and eye bones if the model is rigged
        const eyes: THREE.Object3D[] = [];
        scene.traverse((child) => {
            if ((child as any).isBone) {
                const name = child.name.toLowerCase();
                if (name.includes('head')) {
                    headBoneRef.current = child;
                }
                if (name.includes('eye')) {
                    eyes.push(child);
                }
            }
        });
        eyeBonesRef.current = eyes;

        const handleMouseMove = (event: MouseEvent) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [scene]);

    useFrame(() => {
        // Redefined logic: Treat the model as the center of the screen for tracking calculations.
        // mousePosition.x is -1 to 1 based on screen width.
        // mousePosition.y is -1 to 1 based on screen height.

        const lerpFactor = 0.08; // Smooth tracking

        // 1. Torso/Body rotation (Yaw) - The model turns its side when cursor is left/right
        // We map screen X (-1 to 1) to a significant rotation range (-45 to 45 deg)
        const targetBodyYaw = mousePosition.x * (Math.PI / 4);

        // 2. Head rotation (Pitch/Yaw) - More localized tracking
        const targetHeadYaw = mousePosition.x * (Math.PI / 6);
        const targetHeadPitch = -mousePosition.y * (Math.PI / 8);

        if (groupRef.current) {
            // Rotate the entire model to turn its side
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetBodyYaw, lerpFactor);
        }

        if (headBoneRef.current) {
            // Rotate the head independently for more detail
            // Note: We subtract body rotation from head rotation to keep the head pointed at the target
            headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetHeadYaw, lerpFactor * 1.5);
            headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetHeadPitch, lerpFactor * 1.5);

            // Rotate eyes slightly faster
            eyeBonesRef.current.forEach(eye => {
                eye.rotation.y = THREE.MathUtils.lerp(eye.rotation.y, targetHeadYaw * 0.5, lerpFactor * 2);
                eye.rotation.x = THREE.MathUtils.lerp(eye.rotation.x, targetHeadPitch * 0.5, lerpFactor * 2);
            });
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={1.2} position={[0, -0.4, 0]} />
        </group>
    );
};

export default function AgentModel() {
    return (
        <div className="absolute right-4 bottom-40 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] z-20 pointer-events-none hidden md:block">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <Model />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -0.4, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate={false} autoRotateSpeed={2} />
            </Canvas>
        </div>
    );
}

// Preload the model for faster loading
useGLTF.preload('/agent.glb');
