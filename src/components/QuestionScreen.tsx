import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface QuestionScreenProps {
  title: string;
  options: Option[];
  onContinue: (selectedId: string) => void;
}

export default function QuestionScreen({ title, options, onContinue }: QuestionScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div 
      className="min-h-[100svh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--surface-base)' }}
    >
      <div className="max-w-md w-full relative z-10">
        <h2 
          className="text-center mb-8"
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--weight-bold)',
            lineHeight: 'var(--leading-snug)',
            letterSpacing: 'var(--tracking-tight)'
          }}
        >
          {title}
        </h2>

        <div className="flex flex-col gap-4">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className="w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between hover:-translate-y-[2px]"
                style={{
                  backgroundColor: isSelected ? 'var(--surface-raised)' : 'var(--surface-card)',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                  boxShadow: isSelected ? 'var(--glow-sm)' : 'var(--shadow-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-md)',
                  transform: isSelected ? 'translateY(-2px)' : undefined,
                }}
              >
                <div className="flex items-center gap-4">
                  <option.Icon 
                    className="w-6 h-6 transition-colors duration-200" 
                    style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}
                  />
                  <span style={{ fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)' }}>
                    {option.label}
                  </span>
                </div>
                <div 
                  className="w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center"
                  style={{ 
                    borderColor: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    backgroundColor: isSelected ? 'var(--accent)' : 'transparent'
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--text-on-accent)' }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button 
          disabled={!selectedId}
          onClick={() => selectedId && onContinue(selectedId)}
          className={`w-full mt-8 py-4 rounded-full font-semibold transition-all duration-200 ${!selectedId ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'}`}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--text-on-accent)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            boxShadow: selectedId ? 'var(--glow-sm)' : 'none'
          }}
        >
          Continuar
        </button>
      </div>

      <div className="stars ep-starfield absolute inset-0 opacity-40 pointer-events-none" />
    </div>
  );
}