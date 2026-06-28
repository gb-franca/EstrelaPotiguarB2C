import { MessageCircle, Phone, UserRound } from 'lucide-react';
import { buildGuidePhoneUrl, buildGuideWhatsAppUrl, type GuidedTour } from '../data/constellations';

interface TourGuidePanelProps {
  guidedTour: GuidedTour;
  routeName: string;
  variant?: 'compact' | 'full';
}

export default function TourGuidePanel({ guidedTour, routeName, variant = 'full' }: TourGuidePanelProps) {
  const { guide, note } = guidedTour;
  const whatsappUrl = buildGuideWhatsAppUrl(guide, routeName);
  const phoneUrl = buildGuidePhoneUrl(guide);

  if (variant === 'compact') {
    return (
      <div
        className="mt-3 p-3 rounded-xl border flex items-center justify-between gap-3"
        style={{
          backgroundColor: 'rgba(246, 55, 236, 0.06)',
          borderColor: 'rgba(246, 55, 236, 0.3)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <UserRound size={14} style={{ color: 'var(--aurora)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--aurora)', fontWeight: 600 }}>
            Com guia · {guide.name}
          </span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: '#25D366',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          <MessageCircle size={12} />
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div
      className="mb-8 p-5 rounded-2xl border"
      style={{
        backgroundColor: 'rgba(246, 55, 236, 0.06)',
        borderColor: 'rgba(246, 55, 236, 0.35)',
        boxShadow: '0 0 20px rgba(246, 55, 236, 0.08)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(246, 55, 236, 0.15)',
            border: '1px solid rgba(246, 55, 236, 0.35)',
          }}
        >
          <UserRound size={22} style={{ color: 'var(--aurora)' }} />
        </div>

        <div className="flex-1 min-w-0">
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--aurora)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Roteiro com guia local
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--text-primary)',
              marginBottom: 2,
            }}
          >
            {guide.name}
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 8 }}>
            {guide.role}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 10 }}>
            {guide.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {guide.languages.map((lang) => (
              <span
                key={lang}
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--surface-base)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {lang}
              </span>
            ))}
            {guide.priceFrom && (
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: '11px',
                  color: 'var(--aurora)',
                  backgroundColor: 'rgba(246, 55, 236, 0.1)',
                  border: '1px solid rgba(246, 55, 236, 0.25)',
                  fontWeight: 600,
                }}
              >
                A partir de {guide.priceFrom}
              </span>
            )}
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 'var(--leading-relaxed)' }}>
            {note}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full transition-transform hover:scale-105"
              style={{
                backgroundColor: '#25D366',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
            <a
              href={phoneUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--surface-base)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              <Phone size={16} style={{ color: 'var(--aurora)' }} />
              {guide.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
