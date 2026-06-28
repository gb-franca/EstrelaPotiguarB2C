import Loading from './components/Loading'
import QuestionScreen from './components/QuestionScreen'
import ItineraryScreen from './components/ItineraryScreen'
import ExploreScreen from './components/ExploreScreen'
import BonusesScreen from './components/BonusesScreen'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { User, Heart, Users, PartyPopper, Mountain, Umbrella, Utensils, Landmark, Coins, Banknote, Wallet, Gem, Map, UserCircle, Route, Star, Gift } from 'lucide-react'
import { CONSTELLATIONS, getUnlockedSponsoredOffers, getPendingSponsoredOffers } from './data/constellations'
import {
  type RoadmapProgress,
  createEmptyProgress,
  isRoadmapComplete,
  sumTotalStars,
  sumTotalPoints,
  getExplorerLevel,
} from './data/roadmapProgress'

const Q1_OPTIONS = [
  { id: 'solo', label: 'Solo', Icon: User },
  { id: 'casal', label: 'Casal', Icon: Heart },
  { id: 'familia', label: 'Família', Icon: Users },
  { id: 'galera', label: 'Galera', Icon: PartyPopper }
];

const Q2_OPTIONS = [
  { id: 'aventura', label: 'Aventura', Icon: Mountain },
  { id: 'relax', label: 'Sol e Praia ', Icon: Umbrella },
  { id: 'gastronomia', label: 'Gastronomia', Icon: Utensils },
  { id: 'cultura', label: 'Cultura', Icon: Landmark }
];

const Q3_OPTIONS = [
  { id: '100', label: 'R$ 0 - 100', Icon: Coins },
  { id: '500', label: 'R$ 100 - 500', Icon: Banknote },
  { id: '1000', label: 'R$ 500 - 1000', Icon: Wallet },
  { id: '1000+', label: 'R$ 1000+', Icon: Gem }
];

export default function App() {
  const [step, setStep] = useState<'loading' | 'q1' | 'q2' | 'q3' | 'analyzing' | 'results'>('loading')
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' })
  const [activeTab, setActiveTab] = useState<'roteiro' | 'explorar' | 'bonus' | 'perfil'>('roteiro')
  const [activeRoadmapId, setActiveRoadmapId] = useState('reis-magos')
  const [progressByRoadmap, setProgressByRoadmap] = useState<Record<string, RoadmapProgress>>({})

  const stopCounts = useMemo(
    () => Object.fromEntries(CONSTELLATIONS.map((c) => [c.id, c.stops.length])),
    [],
  )

  const activeRoadmapIds = useMemo(
    () =>
      CONSTELLATIONS.filter((c) => {
        const p = progressByRoadmap[c.id]
        return p?.started && !isRoadmapComplete(p, c.stops.length)
      }).map((c) => c.id),
    [progressByRoadmap],
  )

  const handleProgressChange = useCallback((constellationId: string, progress: RoadmapProgress) => {
    setProgressByRoadmap((prev) => ({ ...prev, [constellationId]: progress }))
  }, [])

  const handleSelectConstellation = useCallback((constellationId: string) => {
    setActiveRoadmapId(constellationId)
    setProgressByRoadmap((prev) => ({
      ...prev,
      [constellationId]: prev[constellationId] ?? createEmptyProgress(),
    }))
    setActiveTab('roteiro')
  }, [])

  const totalStars = sumTotalStars(progressByRoadmap)
  const totalPoints = sumTotalPoints(progressByRoadmap, stopCounts)
  const explorerLevel = getExplorerLevel(totalStars)
  const unlockedOffers = getUnlockedSponsoredOffers(progressByRoadmap)
  const pendingOffers = getPendingSponsoredOffers(progressByRoadmap)
  const activeProgress = progressByRoadmap[activeRoadmapId] ?? createEmptyProgress()

  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('q1')
      }, 2000)
      return () => clearTimeout(timer)
    }
    if (step === 'analyzing') {
      const timer = setTimeout(() => {
        setStep('results')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [step])

  if (step === 'q1') {
    return (
      <QuestionScreen
        title="Quem viaja com você?"
        options={Q1_OPTIONS}
        onContinue={(id) => {
          setAnswers(prev => ({ ...prev, q1: id }))
          setStep('q2')
        }}
      />
    )
  }

  if (step === 'q2') {
    return (
      <QuestionScreen
        key="q2"
        title="Qual a vibe hoje?"
        options={Q2_OPTIONS}
        onContinue={(id) => {
          setAnswers(prev => ({ ...prev, q2: id }))
          setStep('q3')
        }}
      />
    )
  }

  if (step === 'q3') {
    return (
      <QuestionScreen
        key="q3"
        title="Termômetro do bolso? (Orçamento):"
        options={Q3_OPTIONS}
        onContinue={(id) => {
          const finalAnswers = { ...answers, q3: id }
          setAnswers(finalAnswers)
          setStep('analyzing')
          console.log('Finished questions! Transitioning to analyzing state.', finalAnswers)
        }}
      />
    )
  }

  if (step === 'analyzing') {
    return (
      <Loading
        messages={[
          'Estamos alinhando as estrelas para você...',
          'Prepare-se para conhecer o brilho da região...'
        ]}
        intervalMs={4000}
        fadeMs={800}
      />
    )
  }

  if (step === 'results') {
    return (
      <div className="flex flex-col md:flex-row h-[100svh] w-full overflow-hidden" style={{ backgroundColor: 'var(--surface-base)' }}>

        {/* Main Sidebar (Tabs) - Left on Desktop, Bottom on Mobile */}
        <aside
          className="flex-shrink-0 z-50 md:w-20 md:h-[100svh] md:flex-col md:border-r md:border-t-0 border-t order-last md:order-first fixed md:relative bottom-0 w-full flex md:justify-start justify-around items-center py-2 md:py-6 md:px-0 px-2"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {/* Logo only visible on Desktop */}
          <div className="hidden md:flex flex-col items-center mb-8 px-2 w-full">
            <img
              src="/src/assets/estrela-mark.svg"
              alt="Estrela Potiguar"
              className="w-10 h-10 mb-2"
              style={{ filter: 'drop-shadow(var(--glow-sm))' }}
            />
            <div className="w-8 h-px opacity-30 mt-2" style={{ backgroundColor: 'var(--border-strong)' }} />
          </div>

          {/* Navigation Tabs */}
          <button
            onClick={() => setActiveTab('roteiro')}
            className="flex flex-col items-center gap-1 p-2 md:w-full md:py-4 transition-colors"
            style={{ color: activeTab === 'roteiro' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <Route size={24} />
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'roteiro' ? 600 : 400 }}>Roteiro</span>
          </button>

          <button
            onClick={() => setActiveTab('explorar')}
            className="flex flex-col items-center gap-1 p-2 md:w-full md:py-4 transition-colors"
            style={{ color: activeTab === 'explorar' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <Map size={24} />
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'explorar' ? 600 : 400 }}>Explorar</span>
          </button>

          <button
            onClick={() => setActiveTab('bonus')}
            className="relative flex flex-col items-center gap-1 p-2 md:w-full md:py-4 transition-colors"
            style={{ color: activeTab === 'bonus' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <Gift size={24} />
            {unlockedOffers.length > 0 && (
              <span
                className="absolute top-1 right-1 md:top-2 md:right-3 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#ffc857',
                  color: '#100f46',
                  fontSize: '9px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {unlockedOffers.length}
              </span>
            )}
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'bonus' ? 600 : 400 }}>Bônus</span>
          </button>

          {/* Spacer to push profile to bottom on desktop */}
          <div className="hidden md:block flex-1" />

          <button
            onClick={() => setActiveTab('perfil')}
            className="flex flex-col items-center gap-1 p-2 md:w-full md:py-4 transition-colors"
            style={{ color: activeTab === 'perfil' ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            <UserCircle size={24} />
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'perfil' ? 600 : 400 }}>Perfil</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full h-[calc(100svh-64px)] md:h-[100svh] overflow-hidden relative">
          {activeTab === 'roteiro' && (
            <ItineraryScreen
              key={activeRoadmapId}
              constellationId={activeRoadmapId}
              progress={activeProgress}
              onProgressChange={(p) => handleProgressChange(activeRoadmapId, p)}
              onSwitchRoadmap={setActiveRoadmapId}
              onExploreMore={() => setActiveTab('explorar')}
              onBack={() => setActiveTab('explorar')}
              activeRoadmapIds={activeRoadmapIds}
            />
          )}
          {activeTab === 'explorar' && (
            <ExploreScreen
              progressByRoadmap={progressByRoadmap}
              onSelectConstellation={handleSelectConstellation}
            />
          )}

          {activeTab === 'bonus' && (
            <BonusesScreen
              unlockedOffers={unlockedOffers}
              pendingOffers={pendingOffers}
              onExplore={() => setActiveTab('explorar')}
            />
          )}

          {activeTab === 'perfil' && (
            <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
              <div className="stars ep-starfield absolute inset-0 opacity-40 pointer-events-none" />
              <div className="relative z-10 p-8 rounded-2xl border w-full max-w-md" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Seu Perfil
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '24px' }}>
                  {explorerLevel} · {totalStars} estrelas coletadas
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}>
                    <Star size={20} style={{ color: 'var(--accent)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--accent)' }}>{totalStars}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Estrelas</p>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}>
                    <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--accent)' }}>{totalPoints}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Pontos</p>
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  {CONSTELLATIONS.map((c) => {
                    const p = progressByRoadmap[c.id]
                    if (!p?.started) return null
                    const complete = isRoadmapComplete(p, c.stops.length)
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ backgroundColor: 'var(--surface-base)', fontSize: 'var(--text-sm)' }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>{c.name.replace('Constelação ', '')}</span>
                        <span style={{ color: complete ? 'var(--mare)' : 'var(--accent)', fontWeight: 600 }}>
                          {complete ? 'Completa' : `${p.collectedStopIds.length}/${c.stops.length}`}
                        </span>
                      </div>
                    )
                  })}
                  {Object.values(progressByRoadmap).every((p) => !p.started) && (
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                      Inicie um roteiro em Explorar para começar a coletar estrelas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
    )
  }

  if (step === 'loading') {
    return <Loading showMessages={false} />
  }

  return null
}


