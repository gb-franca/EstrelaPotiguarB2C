import { useState, useEffect } from 'react';
import markImg from '../assets/estrela-mark.svg';

const DEFAULT_MESSAGES = [
  'O céu potiguar está chegando…',
  'Alinhando as estrelas…',
  'Montando o seu céu…',
  'Buscando atrações por perto…',
  'Quase lá, prepare-se para brilhar…',
];

interface LoadingProps {
  messages?: string[];
  intervalMs?: number;
  fadeMs?: number;
  showMessages?: boolean;
}

function ShootingStar({ delay, duration, initialWidth }: { delay: number, duration: number, initialWidth: number }) {
  const [style, setStyle] = useState({
    top: '-10%',
    right: '-10%',
    width: `${initialWidth}%`
  });

  const randomize = () => {
    let top, right;
    // Keep generating until the coordinate is strictly outside the center area.
    // Center is approx 20% to 80% for both dimensions.
    do {
      top = Math.random() * 120 - 10; // -10% to 110%
      right = Math.random() * 120 - 10; // -10% to 110%
    } while (top > 20 && top < 80 && right > 20 && right < 80);

    setStyle({
      top: `${top}%`,
      right: `${right}%`,
      width: `${30 + Math.random() * 20}%`
    });
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <span 
      className="shooter"
      style={{
        ...style,
        animation: `ep-shoot ${duration}s ease-in ${delay}s infinite`
      }}
      onAnimationIteration={randomize}
    />
  );
}

export default function Loading({
  messages = DEFAULT_MESSAGES,
  intervalMs = 2400,
  fadeMs = 380,
  showMessages = true,
}: LoadingProps = {}) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgOpacity, setMsgOpacity] = useState(1);

  useEffect(() => {
    if (!showMessages || messages.length === 0) return;

    const interval = setInterval(() => {
      setMsgOpacity(0);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % messages.length);
        setMsgOpacity(1);
      }, fadeMs);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [showMessages, messages.length, intervalMs, fadeMs]);

  return (
    <div className="loader" data-theme="dark">
      <div className="stars ep-starfield"></div>
      <div className="stars b ep-starfield"></div>
      <div className="glow-floor"></div>
      <ShootingStar delay={1.2} duration={5.5} initialWidth={46} />
      <ShootingStar delay={3.6} duration={6.5} initialWidth={38} />
      <ShootingStar delay={6.0} duration={7.5} initialWidth={30} />

      <div className="loader-center">
        <div className="mark-wrap">
          <img
            className="mark w-24 h-24 md:w-32 md:h-32"
            src={markImg}
            alt="Estrela Potiguar mark"
          />
        </div>
        <h1
          className="word text-[32px] md:text-[40px] text-white"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-bold)' }}
        >
          Estrela Potiguar
        </h1>
        {showMessages && (
          <p
            className="msg transition-opacity"
            style={{
              opacity: msgOpacity,
              fontSize: 'var(--text-lg, 19px)',
              transitionDuration: `${fadeMs}ms`,
            }}
          >
            {messages[msgIndex]}
          </p>
        )}
        <div className="track w-[200px] md:w-[280px]">
          <span></span>
        </div>
      </div>

      <p className="foot">Litoral · Rio Grande do Norte</p>
    </div>
  );
}
