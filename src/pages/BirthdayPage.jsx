import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import confetti from 'canvas-confetti';
import BirthdayCard3D from '../components/BirthdayCard3D';

const BirthdayPage = () => {
  const [name, setName] = useState('');
  const [recipientName, setRecipientName] = useState('Bạn');
  const [wish, setWish] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleGenerateWish = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Không thể tạo lời chúc. Vui lòng thử lại.');

      const data = await response.json();
      setWish(data.wish);
      setRecipientName(name);
      handleConfettiClick();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="birthday-container" style={{ minHeight: '100vh', width: '100%', paddingBottom: '2rem' }}>
      <h1 className="birthday-title" style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '2.2rem' }}>Chúc mừng sinh nhật! 🎂</h1>

      <div style={{ maxWidth: '500px', margin: '0 auto 0.5rem', padding: '0 1rem', width: '100%' }}>
        <form onSubmit={handleGenerateWish} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.9)', padding: '0.8rem' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tên người nhận:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            className="button"
            disabled={isLoading || !name.trim()}
            style={{ flex: 1, minWidth: '120px' }}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo thiệp ✨'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      </div>

      <div className="canvas-wrapper" style={{ height: '550px', width: '100%', cursor: 'pointer', borderRadius: '20px' }} onClick={handleConfettiClick}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <BirthdayCard3D recipientName={recipientName} wish={wish} />
            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <Environment preset="city" />
          </Suspense>
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
