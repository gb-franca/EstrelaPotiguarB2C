import { useState } from 'react';
import { Star, StarOff, Check, Pencil } from 'lucide-react';
import type { PlaceFeedback, ShineFeedback } from '../data/roadmapProgress';
import { SHINE_FEEDBACK_LABELS } from '../data/roadmapProgress';

interface StarFeedbackFormProps {
  targetLabel: string;
  variant?: 'stop' | 'route';
  existing?: PlaceFeedback;
  onSubmit: (feedback: PlaceFeedback) => void;
}

export default function StarFeedbackForm({
  targetLabel,
  variant = 'stop',
  existing,
  onSubmit,
}: StarFeedbackFormProps) {
  const [selected, setSelected] = useState<ShineFeedback | null>(existing?.shine ?? null);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [editing, setEditing] = useState(false);

  const isRoute = variant === 'route';
  const heading = isRoute ? 'Como foi o roteiro?' : 'Como foi este lugar?';
  const prompt = isRoute
    ? `O roteiro "${targetLabel}" brilhou no seu céu?`
    : `"${targetLabel}" brilhou para você?`;

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit({
      shine: selected,
      comment: comment.trim() || undefined,
      submittedAt: new Date().toISOString(),
    });
    setEditing(false);
  };

  const labels = selected ? SHINE_FEEDBACK_LABELS[selected] : null;

  if (existing?.submittedAt && !editing) {
    const shine = existing.shine;
    const meta = SHINE_FEEDBACK_LABELS[shine];
    return (
      <div
        className="mt-4 p-4 rounded-xl border text-left"
        style={{
          backgroundColor: shine === 'shine' ? 'rgba(248, 222, 34, 0.06)' : 'rgba(100, 100, 140, 0.08)',
          borderColor: shine === 'shine' ? 'rgba(248, 222, 34, 0.35)' : 'var(--border-subtle)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {shine === 'shine' ? (
              <Star size={16} fill="var(--accent)" style={{ color: 'var(--accent)', flexShrink: 0 }} />
            ) : (
              <StarOff size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            )}
            <div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: meta.color }}>
                {meta.submitted}
              </p>
              {existing.comment && (
                <p
                  className="mt-1 line-clamp-3"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}
                >
                  {existing.comment}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected(existing.shine);
              setComment(existing.comment ?? '');
              setEditing(true);
            }}
            className="shrink-0 p-1.5 rounded-lg cursor-pointer hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Editar feedback"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-4 p-4 rounded-xl border text-left"
      style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
    >
      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
        {heading}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
        {prompt}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {(['shine', 'fade'] as const).map((key) => {
          const meta = SHINE_FEEDBACK_LABELS[key];
          const active = selected === key;
          const Icon = key === 'shine' ? Star : StarOff;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className="flex flex-col items-start gap-1 p-3 rounded-xl border cursor-pointer transition-all"
              style={{
                backgroundColor: active ? meta.softBg : 'var(--surface-card)',
                borderColor: active ? meta.border : 'var(--border-subtle)',
                boxShadow: active && key === 'shine' ? '0 0 12px rgba(248,222,34,0.15)' : undefined,
              }}
            >
              <Icon
                size={18}
                fill={active && key === 'shine' ? meta.color : undefined}
                style={{ color: active ? meta.color : 'var(--text-muted)' }}
              />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: active ? meta.color : 'var(--text-primary)' }}>
                {meta.action}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.3, textAlign: 'left' }}>
                {meta.hint}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              selected === 'shine'
                ? 'O que fez este lugar brilhar? (opcional)'
                : 'O que apagou o brilho? (opcional)'
            }
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border resize-none outline-none mb-3"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-full font-semibold cursor-pointer transition-all hover:scale-[1.01] inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: labels?.color ?? 'var(--accent)',
              color: selected === 'shine' ? 'var(--text-on-accent)' : '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <Check size={16} />
            Enviar Avaliação
          </button>
        </>
      )}
    </div>
  );
}
