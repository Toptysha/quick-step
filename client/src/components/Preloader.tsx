// client/src/components/Preloader.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  // visible -> fading -> gone
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    document.documentElement.classList.add('loading');

    const finish = () => {
      // запускаем плавное исчезновение
      setPhase('fading');
      // даём анимации завершиться, затем размонтируем
      const timeout = setTimeout(() => {
        setPhase('gone');
        document.documentElement.classList.remove('loading');
      }, 400); // это должно совпадать с CSS transition длительностью
      return () => clearTimeout(timeout);
    };

    if (document.readyState === 'complete') {
      return finish();
    } else {
      window.addEventListener('load', finish, { once: true });
      return () => window.removeEventListener('load', finish);
    }
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      id="preloader-html"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.4s ease',
        // чтобы поверх ничего не «просвечивало»
        pointerEvents: 'auto',
      }}
    >
      <div className="preloader-loaderVision" />
    </div>
  );
}
