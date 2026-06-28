import { useState } from 'react';
import { Sparkles, Copy, Check, Gift } from 'lucide-react';
import type { SponsoredOffer } from '../data/constellations';

interface SponsoredOfferPanelProps {
  venueName: string;
  offer: SponsoredOffer;
  variant?: 'compact' | 'full';
}

export function SponsoredOfferPanel({ venueName, offer, variant = 'full' }: SponsoredOfferPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'compact') {
    return (
      <div
        className="mt-3 p-3 rounded-xl border"
        style={{
          backgroundColor: 'rgba(255, 200, 87, 0.08)',
          borderColor: 'rgba(255, 200, 87, 0.35)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Gift size={14} style={{ color: '#ffc857', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-xs)', color: '#ffc857', fontWeight: 600 }}>
              {offer.discountLabel} · {offer.title}
            </span>
          </div>
          <button
            type="button"
            onClick={copyCode}
            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer"
            style={{
              backgroundColor: 'rgba(255, 200, 87, 0.15)',
              color: '#ffc857',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {offer.code}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-xl border text-left"
      style={{
        backgroundColor: 'rgba(255, 200, 87, 0.08)',
        borderColor: 'rgba(255, 200, 87, 0.35)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} style={{ color: '#ffc857' }} />
        <span style={{ fontSize: 'var(--text-xs)', color: '#ffc857', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Oferta desbloqueada
        </span>
      </div>
      <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffc857', marginBottom: 4 }}>
        {offer.discountLabel}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        {offer.title} · {venueName}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 12 }}>
        {offer.description}
      </p>
      <div
        className="flex items-center justify-between gap-3 p-3 rounded-lg"
        style={{ backgroundColor: 'var(--surface-base)', border: '1px dashed rgba(255, 200, 87, 0.45)' }}
      >
        <div>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Código promocional
          </p>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'monospace', color: '#ffc857', marginTop: 2 }}>
            {offer.code}
          </p>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer transition-transform hover:scale-105"
          style={{
            backgroundColor: 'rgba(255, 200, 87, 0.15)',
            color: '#ffc857',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      {offer.validUntil && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 10 }}>
          {offer.validUntil}
        </p>
      )}
    </div>
  );
}

interface SponsoredOfferModalProps {
  venueName: string;
  offer: SponsoredOffer;
  onClose: () => void;
}

export function SponsoredOfferModal({ venueName, offer, onClose }: SponsoredOfferModalProps) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(4, 4, 20, 0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-6 ep-complete-pop"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'rgba(255, 200, 87, 0.45)',
          boxShadow: '0 0 40px rgba(255, 200, 87, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', border: '1px solid rgba(255, 200, 87, 0.35)' }}
          >
            <Gift size={28} style={{ color: '#ffc857' }} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}
          >
            Bônus especial!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Você desbloqueou uma oferta exclusiva ao coletar esta estrela patrocinada.
          </p>
        </div>

        <SponsoredOfferPanel venueName={venueName} offer={offer} />

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-5 py-3.5 rounded-full font-semibold cursor-pointer transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            boxShadow: 'var(--glow-sm)',
          }}
        >
          Continuar roteiro
        </button>
      </div>
    </div>
  );
}
