import { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { projectStopsToSvg, type RoadmapStop } from '../data/constellations';
import { getExplorerLevel, type PlaceFeedback } from '../data/roadmapProgress';
import StarFeedbackForm from './StarFeedbackForm';

function MapPin({ variant, size = 32 }: { variant: 'accent' | 'aurora' | 'mare'; size?: number }) {
  const id = `complete-pin-${variant}`;
  let stops;
  if (variant === 'aurora') {
    stops = (
      <>
        <stop offset="0%" stopColor="#fa9af4" />
        <stop offset="45%" stopColor="#f637ec" />
        <stop offset="100%" stopColor="#c819c0" />
      </>
    );
  } else if (variant === 'mare') {
    stops = (
      <>
        <stop offset="0%" stopColor="#c2f07e" />
        <stop offset="45%" stopColor="#96df29" />
        <stop offset="100%" stopColor="#74b417" />
      </>
    );
  } else {
    stops = (
      <>
        <stop offset="0%" stopColor="#fffbe3" />
        <stop offset="45%" stopColor="#f8de22" />
        <stop offset="100%" stopColor="#bfa406" />
      </>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: 'drop-shadow(0 0 10px rgba(248,222,34,0.6))' }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="40%" r="60%">
          {stops}
        </radialGradient>
      </defs>
      <path d={SPARKLE} fill={`url(#${id})`} stroke="rgba(4,4,20,0.35)" strokeWidth={2} />
      <path d={SPARKLE} fill="rgba(255,255,255,0.35)" transform="translate(50 42) scale(0.34) translate(-50 -50)" />
    </svg>
  );
}

function createIcon(variant: 'accent' | 'aurora' | 'mare') {
  return L.divIcon({
    html: renderToString(<MapPin variant={variant} size={36} />),
    className: 'custom-leaflet-icon bg-transparent border-0',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function MapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 12 });
  }, [map, positions]);
  return null;
}

const SPARKLE = 'M50 3 C54.5 31 69 45.5 97 50 C69 54.5 54.5 69 50 97 C45.5 69 31 54.5 3 50 C31 45.5 45.5 31 50 3 Z';

const VARIANT_STROKE: Record<'accent' | 'aurora' | 'mare', string> = {
  accent: '#f8de22',
  aurora: '#f637ec',
  mare: '#96df29',
};

interface ConstellationCompleteProps {
  roadmapName: string;
  constellationName: string;
  stops: RoadmapStop[];
  starsCollected: number;
  totalStars: number;
  pointsEarned: number;
  starPoints: number;
  completionBonus: number;
  onExploreMore?: () => void;
  routeFeedback?: PlaceFeedback;
  onRouteFeedback?: (feedback: PlaceFeedback) => void;
}

export default function ConstellationComplete({
  roadmapName,
  constellationName,
  stops,
  starsCollected,
  totalStars,
  pointsEarned,
  starPoints,
  completionBonus,
  onExploreMore,
  routeFeedback,
  onRouteFeedback,
}: ConstellationCompleteProps) {
  const [copied, setCopied] = useState(false);
  const projected = useMemo(() => projectStopsToSvg(stops, 100, 100, 14), [stops]);
  const pathPositions: [number, number][] = stops.map((s) => [s.lat, s.lng]);
  const linePath = projected.map((p) => `${p.x},${p.y}`).join(' ');

  const shareText = `Completei a ${constellationName} no Estrela Potiguar! ✨ ${stops.length} estrelas coletadas em Natal, RN — ${roadmapName}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const copyShare = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="h-full w-full relative overflow-x-hidden flex flex-col md:flex-row"
      style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-primary)' }}
    >
      <div className="stars ep-starfield absolute inset-0 opacity-50 pointer-events-none" />

      {/* Left: gamified summary */}
      <div className="w-full md:w-1/2 p-6 pb-24 md:pb-6 relative z-10 pt-8 md:overflow-y-auto">
        <div className="max-w-md mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ep-complete-pop"
            style={{ backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          >
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Constelação formada!
            </span>
          </div>

          <h2
            className="mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-bold)',
              lineHeight: 'var(--leading-tight)',
            }}
          >
            {constellationName}
          </h2>
          <p className="mb-1" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)' }}>
            {roadmapName}
          </p>
          <p className="mb-8" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Você iluminou {stops.length} estrelas pelo céu potiguar
          </p>

          {/* Abstract constellation preview */}
          <div
            className="relative mx-auto mb-8 rounded-2xl border overflow-hidden ep-complete-pop"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--glow-sm)',
              maxWidth: 280,
              aspectRatio: '1',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <filter id="constellation-glow">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <polyline
                points={linePath}
                fill="none"
                stroke="#f8de22"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
                filter="url(#constellation-glow)"
              />
              {projected.map((point, i) => (
                <g key={stops[i].id} transform={`translate(${point.x}, ${point.y})`}>
                  <circle r="6" fill="rgba(248,222,34,0.15)" />
                  <circle r="2.5" fill={VARIANT_STROKE[stops[i].variant]} />
                </g>
              ))}
            </svg>
          </div>

          {/* Gamification stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Estrelas', value: `${starsCollected}/${totalStars}` },
              { label: 'Pontos', value: `+${pointsEarned}` },
              { label: 'Nível', value: getExplorerLevel(starsCollected) },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-3 rounded-xl border"
                style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
              >
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--accent)' }}>{stat.value}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {completionBonus > 0 && (
            <p className="mb-6" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              {starPoints} pts das estrelas + {completionBonus} pts bônus de conclusão
            </p>
          )}

          {onRouteFeedback && (
            <div className="mb-8 text-left">
              <StarFeedbackForm
                targetLabel={roadmapName}
                variant="route"
                existing={routeFeedback}
                onSubmit={onRouteFeedback}
              />
            </div>
          )}

          {onExploreMore && (
            <button
              type="button"
              onClick={onExploreMore}
              className="w-full mb-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-on-accent)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              Explorar mais constelações
            </button>
          )}

          {/* Share */}
          <p
            className="mb-4"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}
          >
            Compartilhe sua constelação
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-4 py-3 rounded-full cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: '#25D366', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={shareTwitter}
              className="flex items-center gap-2 px-4 py-3 rounded-full cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
            >
              <Share2 size={18} />
              X
            </button>
            <button
              type="button"
              onClick={copyShare}
              className="flex items-center gap-2 px-4 py-3 rounded-full cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--surface-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
            >
              {copied ? <Check size={18} style={{ color: 'var(--mare)' }} /> : <Copy size={18} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>

      {/* Right: map with constellation */}
      <div
        className="w-full md:w-1/2 h-[45vh] md:h-auto relative border-t md:border-t-0 md:border-l z-0"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--map-canvas)' }}
      >
        <MapContainer
          center={[-5.78, -35.2]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          zoomControl={false}
          dragging={false}
        >
          <MapBounds positions={pathPositions} />
          <TileLayer
            attribution=""
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Polyline
            positions={pathPositions}
            pathOptions={{
              color: '#f8de22',
              weight: 3,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          {stops.map((stop, index) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={createIcon(stop.variant)} zIndexOffset={index} />
          ))}
        </MapContainer>

        <div
          className="absolute bottom-4 left-4 right-4 p-3 rounded-xl border text-center z-[1000] pointer-events-none"
          style={{ backgroundColor: 'rgba(16,15,70,0.85)', borderColor: 'var(--border-subtle)', backdropFilter: 'blur(8px)' }}
        >
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Sua constelação no mapa
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600, marginTop: 4 }}>
            {constellationName}
          </p>
        </div>
      </div>
    </div>
  );
}
