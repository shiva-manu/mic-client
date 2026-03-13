import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const ParticleSystem = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x -= delta * 0.02;
            groupRef.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <group ref={groupRef}>
            <Stars radius={50} depth={50} count={4000} factor={4} saturation={0} fade speed={1.5} />
        </group>
    );
};

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ambientLight intensity={0.5} />
                <ParticleSystem />
                {/* Purple sparkles representing data/neural nodes */}
                <Sparkles count={200} scale={15} size={2.5} speed={0.4} opacity={0.4} color="#a855f7" />
                {/* Blue sparkles representing connections */}
                <Sparkles count={200} scale={15} size={2} speed={0.3} opacity={0.3} color="#3b82f6" />
            </Canvas>
        </div>
    );
}
