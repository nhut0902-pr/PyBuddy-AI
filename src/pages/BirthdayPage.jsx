import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import confetti from 'canvas-confetti';
import BirthdayCard3D from '../components/BirthdayCard3D';
import LoadingSpinner from '../components/LoadingSpinner';

const BirthdayPage = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Basic confetti on load
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleConfettiClick = () => {
      confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
      });
  };

  return (
    <div className="birthday-container" style={{ height: '80vh', width: '100%', position: 'relative' }}>
      <h1 className="birthday-title">Chúc mừng sinh nhật! 🎂</h1>

      <div className="canvas-wrapper" style={{ height: '100%', width: '100%', cursor: 'pointer' }} onClick={handleConfettiClick}>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <BirthdayCard3D />
            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} makeDefault />
        </Canvas>
      </div>

      <div className="birthday-footer" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p className="fade-in-text">Hãy xoay và bấm vào thiệp để mở món quà đặc biệt này!</p>
          <button className="button" onClick={handleConfettiClick}>Bắn pháo hoa 🎉</button>
      </div>
    </div>
  );
};

export default BirthdayPage;
