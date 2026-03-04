import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

const BirthdayCard3D = ({ recipientName = "Bạn", wish }) => {
  const [isOpen, setIsOpen] = useState(false);
  const coverRef = useRef();

  const defaultWish = `Hy vọng tuổi mới của bạn \ntràn ngập niềm vui, \nhạnh phúc và thành công!`;

  useFrame((state, delta) => {
    if (coverRef.current) {
      const targetRotation = isOpen ? -Math.PI * 0.8 : 0;
      coverRef.current.rotation.y = THREE.MathUtils.lerp(coverRef.current.rotation.y, targetRotation, 0.1);
    }
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
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[4.2, 6.2, 0.1]} />
          <meshStandardMaterial color="#d00000" />
        </mesh>

        {/* Inner Right Page (Static) */}
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[4, 6, 0.05]} />
          <meshStandardMaterial color="#fffafa" />
        </mesh>

        <Text
          position={[0, 1.5, 0]}
          fontSize={0.25}
          color="#d00000"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
          textAlign="center"
        >
          {`Chúc mừng sinh nhật,\n${recipientName}!`}
        </Text>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.16}
          color="#333"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
          lineHeight={1.5}
          textAlign="center"
        >
          {wish || defaultWish}
        </Text>

        {/* Front Cover (Rotating) */}
        <group ref={coverRef} position={[-2, 0, 0.05]}>
          <mesh position={[2, 0, 0]}>
            <boxGeometry args={[4.2, 6.2, 0.1]} />
            <meshStandardMaterial color="#ff4d4d" />
          </mesh>

          {/* Front Text */}
          <group position={[2, 0, 0.1]}>
             <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Text
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={3.5}
                    textAlign="center"
                    outlineWidth={0.02}
                    outlineColor="#d00000"
                >
                    {`Gửi tặng\n${recipientName}`}
                </Text>
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.2}
                    color="#ffd700"
                    anchorX="center"
                    anchorY="middle"
                >
                    (Bấm để mở thiệp)
                </Text>
             </Float>
          </group>

          {/* Inner Left Page (Inside the cover) */}
          <mesh position={[2, 0, -0.06]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[4, 6, 0.01]} />
            <meshStandardMaterial color="#fffafa" />
          </mesh>
        </group>
      </group>
    </PresentationControls>
  );
};

export default BirthdayCard3D;
