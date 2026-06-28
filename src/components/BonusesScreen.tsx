import { Gift, Sparkles, Lock, Map } from 'lucide-react';
import {
  type UnlockedSponsoredOffer,
  type PendingSponsoredOffer,
} from '../data/constellations';
import { SponsoredOfferPanel } from './SponsoredOfferPanel';

interface BonusesScreenProps {
  unlockedOffers: UnlockedSponsoredOffer[];
  pendingOffers: PendingSponsoredOffer[];
  onExplore: () => void;
}

function LockedOfferCard({ item }: { item: PendingSponsoredOffer }) {
  const offer = item.stop.sponsoredOffer!;

  return (
    <article
      className="p-5 rounded-2xl border"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-subtle)',
        opacity: 0.75,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--surface-base)', border: '1px dashed var(--border-default)' }}
        >
          <Lock size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="min-w-0">
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Estrela patrocinada · {item.roadmapTitle.replace(/^Roteiro /, '')}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-primary)',
            }}
          >
            {item.stop.title}
          </h3>
        </div>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 'var(--leading-relaxed)' }}>
        {offer.description}
      </p>
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: 'rgba(255, 200, 87, 0.08)',
          border: '1px dashed rgba(255, 200, 87, 0.35)',
          color: '#ffc857',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
        }}
      >
        <Sparkles size={14} />
        Colete a estrela para desbloquear {offer.discountLabel}
      </div>
    </article>
  );
}

function UnlockedOfferCard({ item }: { item: UnlockedSponsoredOffer }) {
  const offer = item.stop.sponsoredOffer!;

  return (
    <article
      className="p-5 rounded-2xl border"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'rgba(255, 200, 87, 0.4)',
        boxShadow: '0 0 24px rgba(255, 200, 87, 0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', border: '1px solid rgba(255, 200, 87, 0.35)' }}
        >
          <Gift size={18} style={{ color: '#ffc857' }} />
        </div>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: '#ffc857', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Cupom ativo
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {item.stop.title} · {item.roadmapTitle.replace(/^Roteiro /, '')}
          </p>
        </div>
      </div>
      <SponsoredOfferPanel venueName={item.stop.title} offer={offer} />
    </article>
  );
}

export default function BonusesScreen({ unlockedOffers, pendingOffers, onExplore }: BonusesScreenProps) {
  const hasAny = unlockedOffers.length > 0 || pendingOffers.length > 0;

  return (
    <div
      className="h-full w-full overflow-y-auto relative"
      style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-primary)' }}
    >
      <div className="stars ep-starfield absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 pb-24 md:px-8 md:pb-8">
        <header className="mb-8 md:mb-10">
          <p
            className="mb-2 uppercase tracking-widest"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.16em' }}
          >
            Bônus
          </p>
          <h1
            className="mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-bold)',
              lineHeight: 'var(--leading-tight)',
            }}
          >
            Cupons e ofertas
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)' }}>
            Desbloqueie benefícios ao coletar estrelas patrocinadas nos roteiros.
          </p>
        </header>

        {!hasAny && (
          <div
            className="text-center py-16 px-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
          >
            <Gift size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', opacity: 0.6 }} />
            <h2
              className="mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}
            >
              Nenhum cupom ainda
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 20, maxWidth: 320, marginInline: 'auto' }}>
              Explore constelações com estrelas patrocinadas e colete-as durante o roteiro para ganhar descontos exclusivos.
            </p>
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold cursor-pointer transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-on-accent)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              <Map size={16} />
              Explorar constelações
            </button>
          </div>
        )}

        {unlockedOffers.length > 0 && (
          <section className="mb-10">
            <h2
              className="mb-4 inline-flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}
            >
              <Sparkles size={18} style={{ color: '#ffc857' }} />
              Desbloqueados ({unlockedOffers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {unlockedOffers.map((item) => (
                <UnlockedOfferCard key={`${item.constellationId}-${item.stop.id}`} item={item} />
              ))}
            </div>
          </section>
        )}

        {pendingOffers.length > 0 && (
          <section>
            <h2
              className="mb-4 inline-flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}
            >
              <Lock size={18} style={{ color: 'var(--text-muted)' }} />
              Para desbloquear ({pendingOffers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingOffers.map((item) => (
                <LockedOfferCard key={`${item.constellationId}-${item.stop.id}`} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
