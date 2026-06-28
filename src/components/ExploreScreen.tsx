import {
  Sun,
  Landmark,
  Trees,
  PawPrint,
  UtensilsCrossed,
  Star,
  Clock,
  MapPin,
  Sparkles,
  Mountain,
  CheckCircle2,
  UserRound,
  Map,
  Compass,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  CONSTELLATIONS,
  projectStopsToSvg,
  type CategoryId,
  type ConstellationRoadmap,
} from '../data/constellations';
import { type RoadmapProgress, isRoadmapComplete } from '../data/roadmapProgress';

const CATEGORY_STYLE: Record<
  CategoryId,
  { color: string; soft: string; Icon: typeof Sun }
> = {
  praia: { color: '#4ad1ff', soft: 'rgba(74, 209, 255, 0.16)', Icon: Sun },
  cultural: { color: '#f637ec', soft: 'rgba(246, 55, 236, 0.16)', Icon: Landmark },
  natureza: { color: '#96df29', soft: 'rgba(150, 223, 41, 0.16)', Icon: Trees },
  pet: { color: '#f8de22', soft: 'rgba(248, 222, 34, 0.16)', Icon: PawPrint },
  gastronomia: { color: '#fff3a8', soft: 'rgba(255, 243, 168, 0.12)', Icon: UtensilsCrossed },
  aventura: { color: '#ff6b5e', soft: 'rgba(255, 107, 94, 0.16)', Icon: Mountain },
};

function ConstellationShape({ item, color }: { item: ConstellationRoadmap; color: string }) {
  const points = useMemo(() => projectStopsToSvg(item.stops, 200, 80, 16), [item.stops]);
  const linePath = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 200 80"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id={`glow-${item.id}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline
        points={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
        filter={`url(#glow-${item.id})`}
      />
      {points.map((point, i) => (
        <g key={i}>
          <circle cx={point.x} cy={point.y} r="5" fill={`${color}22`} />
          <circle cx={point.x} cy={point.y} r="2.5" fill={color} opacity={0.95 - i * 0.05} />
        </g>
      ))}
    </svg>
  );
}

function ProgressBadge({ progress, total }: { progress?: RoadmapProgress; total: number }) {
  if (!progress?.started) return null;

  const complete = isRoadmapComplete(progress, total);
  const collected = progress.collectedStopIds.length;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: complete ? 'rgba(150, 223, 41, 0.2)' : 'rgba(248, 222, 34, 0.15)',
        color: complete ? 'var(--mare)' : 'var(--accent)',
        border: `1px solid ${complete ? 'var(--mare)' : 'var(--accent)'}40`,
      }}
    >
      {complete ? (
        <>
          <CheckCircle2 size={12} />
          Completa
        </>
      ) : (
        <>
          <Star size={12} />
          {collected}/{total} estrelas
        </>
      )}
    </span>
  );
}

function ConstellationCard({
  item,
  progress,
  onSelect,
}: {
  item: ConstellationRoadmap;
  progress?: RoadmapProgress;
  onSelect: (id: string) => void;
}) {
  const style = CATEGORY_STYLE[item.category];
  const CategoryIcon = style.Icon;
  const inProgress = progress?.started && !isRoadmapComplete(progress, item.stops.length);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item.id);
        }
      }}
      className="h-full flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: inProgress ? 'var(--accent)' : item.featured ? 'var(--aurora)' : 'var(--border-subtle)',
        boxShadow: inProgress ? '0 0 16px rgba(248,222,34,0.2)' : item.featured ? '0 0 20px rgba(246,55,236,0.25)' : 'var(--shadow-md)',
      }}
    >
      <div
        className="relative h-36 overflow-hidden"
        style={{
          background: 'radial-gradient(120% 120% at 75% 0%, #252178, #100f46 55%, #07061d)',
        }}
      >
        <div className="stars ep-starfield absolute inset-0 opacity-80" style={{ backgroundColor: 'transparent' }} />
        <ConstellationShape item={item} color={style.color} />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
          <ProgressBadge progress={progress} total={item.stops.length} />
          {item.featured && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--aurora)', color: '#fff' }}
            >
              <Sparkles size={12} />
              Destaque
            </span>
          )}
          {item.curated && !item.featured && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--surface-overlay)', color: 'var(--accent)', backdropFilter: 'blur(6px)' }}
            >
              <Star size={12} />
              Curada
            </span>
          )}
          {item.guidedTour && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'rgba(246, 55, 236, 0.16)', color: 'var(--aurora)', border: '1px solid rgba(246, 55, 236, 0.35)' }}
            >
              <UserRound size={12} />
              Com guia
            </span>
          )}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: style.soft, color: style.color, border: `1px solid ${style.color}40` }}
          >
            <CategoryIcon size={12} />
            {item.categoryLabel}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="mb-2 line-clamp-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--text-primary)',
            lineHeight: 'var(--leading-snug)',
          }}
        >
          {item.name}
        </h3>
        <p
          className="mb-4 flex-1 line-clamp-3"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-4 flex-wrap" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} style={{ color: 'var(--accent)' }} />
            {item.stops.length} estrelas
          </span>
          {item.stops.some((s) => s.sponsored) && (
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: '#ffc857' }}
            >
              <Sparkles size={14} />
              {item.stops.find((s) => s.sponsored)?.sponsoredOffer?.discountLabel ?? 'Oferta exclusiva'}
            </span>
          )}
          {item.guidedTour && (
            <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--aurora)' }}>
              <UserRound size={14} />
              {item.guidedTour.guide.name.split(' ')[0]} · guia
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {item.duration}
          </span>
        </div>
      </div>
    </article>
  );
}

interface ExploreScreenProps {
  progressByRoadmap: Record<string, RoadmapProgress>;
  onSelectConstellation: (id: string) => void;
}

type ExploreSection = 'constellations' | 'free-map';

const SUB_TABS: { id: ExploreSection; label: string; Icon: typeof Star }[] = [
  { id: 'constellations', label: 'Constelações', Icon: Star },
  { id: 'free-map', label: 'Mapa livre', Icon: Map },
];

function ConstellationsSection({
  progressByRoadmap,
  onSelectConstellation,
}: ExploreScreenProps) {
  return (
    <>
      <header className="mb-8 md:mb-10">
        <h2
          className="mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--weight-bold)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          Constelações recomendadas
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)' }}>
          Escolha um roteiro e comece a coletar estrelas. Você pode ter vários caminhos ativos — cada um só se completa ao visitar todos os lugares.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {CONSTELLATIONS.map((item) => (
          <ConstellationCard
            key={item.id}
            item={item}
            progress={progressByRoadmap[item.id]}
            onSelect={onSelectConstellation}
          />
        ))}
      </div>
    </>
  );
}

function FreeMapPlaceholder() {
  return (
    <>
      <header className="mb-8 md:mb-10">
        <h2
          className="mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--weight-bold)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          Explore o mapa livremente
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)' }}>
          Navegue por Natal no seu ritmo, descubra lugares e acenda estrelas por conta própria — sem roteiro fixo.
        </p>
      </header>

      <div
        className="relative rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-subtle)',
          minHeight: 'min(420px, 55vh)',
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundColor: 'var(--map-canvas)' }}
        />
        <div className="stars ep-starfield absolute inset-0 opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[min(420px,55vh)]">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              backgroundColor: 'var(--accent-soft)',
              border: '1px solid var(--accent)',
              boxShadow: 'var(--glow-sm)',
            }}
          >
            <Compass size={32} style={{ color: 'var(--accent)' }} />
          </div>

          <span
            className="inline-block px-3 py-1 rounded-full mb-4"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--aurora)',
              backgroundColor: 'rgba(246, 55, 236, 0.12)',
              border: '1px solid rgba(246, 55, 236, 0.3)',
            }}
          >
            Em breve
          </span>

          <h3
            className="mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-primary)',
            }}
          >
            Mapa livre do litoral potiguar
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: 360,
            }}
          >
            Aqui você poderá explorar o mapa interativo, encontrar pontos de interesse espalhados pela região e coletar estrelas fora dos roteiros curados.
          </p>
        </div>
      </div>
    </>
  );
}

export default function ExploreScreen({ progressByRoadmap, onSelectConstellation }: ExploreScreenProps) {
  const [section, setSection] = useState<ExploreSection>('constellations');

  return (
    <div
      className="h-full w-full overflow-y-auto relative"
      style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-primary)' }}
    >
      <div className="stars ep-starfield absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 pb-24 md:px-8 md:pb-8">
        <header className="mb-6">
          <p
            className="mb-2 uppercase tracking-widest"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.16em' }}
          >
            Explorar
          </p>
          <h1
            className="mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-bold)',
              lineHeight: 'var(--leading-tight)',
            }}
          >
            Descubra o Potiguar
          </h1>

          <div
            className="inline-flex p-1 rounded-full border"
            style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
            role="tablist"
            aria-label="Modos de exploração"
          >
            {SUB_TABS.map(({ id, label, Icon }) => {
              const active = section === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSection(id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all"
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'transparent',
                    color: active ? 'var(--text-on-accent)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: active ? 600 : 500,
                    boxShadow: active ? 'var(--glow-sm)' : undefined,
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
        </header>

        {section === 'constellations' && (
          <ConstellationsSection
            progressByRoadmap={progressByRoadmap}
            onSelectConstellation={onSelectConstellation}
          />
        )}

        {section === 'free-map' && <FreeMapPlaceholder />}
      </div>
    </div>
  );
}
