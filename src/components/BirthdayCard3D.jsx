import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

const BirthdayCard3D = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRotation = useRef(0);

  useFrame((state, delta) => {
    const targetRotation = isOpen ? -Math.PI * 0.8 : 0;
    cardRotation.current = THREE.MathUtils.lerp(cardRotation.current, targetRotation, 0.1);
  });

  return (
    <PresentationControls
      global
      config={{ mass: 2, tension: 500 }}
      snap={{ mass: 4, tension: 1500 }}
      rotation={[0, 0.3, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      <group position={[0, 0, 0]} onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
      }}>
        {/* Back Cover */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[4, 6, 0.1]} />
          <meshStandardMaterial color="#ff4d4d" />
        </mesh>

        {/* Inner Right Page (Static) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.9, 5.9, 0.05]} />
          <meshStandardMaterial color="#fff5f5" />
        </mesh>

        <Text
          position={[0, 1, 0.1]}
          fontSize={0.3}
          color="#d00000"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
        >
          Chúc mừng sinh nhật!
        </Text>
        <Text
          position={[0, -0.5, 0.1]}
          fontSize={0.18}
          color="#444"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
        >
          {`Hy vọng tuổi mới của bạn \ntràn ngập niềm vui, \nhạnh phúc và thành công!`}
        </Text>

        {/* Front Cover (Rotating) */}
        <group position={[-2, 0, 0.05]} rotation={[0, cardRotation.current, 0]}>
          <mesh position={[2, 0, 0]}>
            <boxGeometry args={[4, 6, 0.1]} />
            <meshStandardMaterial color="#ff4d4d" />
          </mesh>

          {/* Front Text */}
          <group position={[2, 0, 0.1]}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Text
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    MỞ RA ĐI!
                </Text>
                <Text
                    position={[0, -1, 0]}
                    fontSize={0.2}
                    color="#ffd700"
                    anchorX="center"
                    anchorY="middle"
                >
                    (Click vào thiệp)
                </Text>
             </Float>
          </group>

          {/* Inner Left Page (Inside the cover) */}
          <mesh position={[2, 0, -0.06]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[3.9, 5.9, 0.01]} />
            <meshStandardMaterial color="#fff5f5" />
          </mesh>
        </group>
      </group>
    </PresentationControls>
  );
};

export default BirthdayCard3D;
