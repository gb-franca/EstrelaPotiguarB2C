import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import ConstellationComplete from './ConstellationComplete';
import { SponsoredOfferModal, SponsoredOfferPanel } from './SponsoredOfferPanel';
import TourGuidePanel from './TourGuidePanel';
import StarFeedbackForm from './StarFeedbackForm';
import { getConstellationById } from '../data/constellations';
import {
  type RoadmapProgress,
  type PlaceFeedback,
  isRoadmapComplete,
  calculateRoadmapPoints,
} from '../data/roadmapProgress';

const SPARKLE = 'M50 3 C54.5 31 69 45.5 97 50 C69 54.5 54.5 69 50 97 C45.5 69 31 54.5 3 50 C31 45.5 45.5 31 50 3 Z';
const PROXIMITY_METERS = 200;

const VARIANT_COLOR: Record<'accent' | 'aurora' | 'mare', string> = {
  accent: 'var(--accent)',
  aurora: 'var(--aurora)',
  mare: 'var(--mare)',
};

const VARIANT_STROKE: Record<'accent' | 'aurora' | 'mare', string> = {
  accent: '#f8de22',
  aurora: '#f637ec',
  mare: '#96df29',
};

interface ItineraryScreenProps {
  constellationId: string;
  progress: RoadmapProgress;
  onProgressChange: (progress: RoadmapProgress) => void;
  onSwitchRoadmap: (id: string) => void;
  onExploreMore: () => void;
  onBack: () => void;
  activeRoadmapIds: string[];
}

function MapPin({
  variant = 'accent',
  size = 40,
  filled = true,
  focused = false,
  sponsored = false,
  style,
  ...rest
}: React.SVGProps<SVGSVGElement> & {
  variant?: 'accent' | 'aurora' | 'mare';
  size?: number;
  filled?: boolean;
  focused?: boolean;
  sponsored?: boolean;
}) {
  const id = `pin-grad-${variant}-${filled ? 'on' : 'off'}-${focused ? 'focus' : 'idle'}-${sponsored ? 'ad' : 'std'}`;
  const strokeColor = sponsored ? '#ffc857' : VARIANT_STROKE[variant];
  const glowFilter = sponsored
    ? 'drop-shadow(0 0 16px rgba(255, 200, 87, 0.85))'
    : focused
      ? 'drop-shadow(0 0 14px rgba(248, 222, 34, 0.7))'
      : undefined;

  if (!filled) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={focused ? 'ep-star-focus' : undefined}
        style={{ filter: glowFilter, ...style }}
        {...rest}
      >
        {sponsored && (
          <circle cx="50" cy="50" r="46" fill="none" stroke="#ffc857" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.85" />
        )}
        <path
          d={SPARKLE}
          fill="rgba(16, 15, 70, 0.55)"
          stroke={strokeColor}
          strokeWidth={focused ? 3 : 2}
        />
      </svg>
    );
  }

  let stops;
  if (sponsored) {
    stops = (
      <>
        <stop offset="0%" stopColor="#fff3c4" />
        <stop offset="45%" stopColor="#ffc857" />
        <stop offset="100%" stopColor="#e6a020" />
      </>
    );
  } else if (variant === 'aurora') {
    stops = (
      <>
        <stop offset="0%" stopColor="var(--ep-aurora-300)" />
        <stop offset="45%" stopColor="var(--ep-aurora-400)" />
        <stop offset="100%" stopColor="var(--ep-aurora-500)" />
      </>
    );
  } else if (variant === 'mare') {
    stops = (
      <>
        <stop offset="0%" stopColor="var(--ep-mare-300)" />
        <stop offset="45%" stopColor="var(--ep-mare-400)" />
        <stop offset="100%" stopColor="var(--ep-mare-500)" />
      </>
    );
  } else {
    stops = (
      <>
        <stop offset="0%" stopColor="var(--ep-star-100)" />
        <stop offset="45%" stopColor="var(--ep-star-400)" />
        <stop offset="100%" stopColor="var(--ep-star-600)" />
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{
        filter: sponsored ? 'drop-shadow(0 0 12px rgba(255, 200, 87, 0.7))' : 'drop-shadow(var(--glow-sm))',
        ...style,
      }}
      {...rest}
    >
      {sponsored && (
        <circle cx="50" cy="50" r="46" fill="none" stroke="#ffc857" strokeWidth="2" opacity="0.7" />
      )}
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

function createIcon(
  variant: 'accent' | 'aurora' | 'mare',
  filled: boolean,
  focused: boolean,
  sponsored = false,
) {
  const pinSize = focused ? 42 : 36;
  return L.divIcon({
    html: renderToString(
      <MapPin variant={variant} size={pinSize} filled={filled} focused={focused} sponsored={sponsored} />,
    ),
    className: 'custom-leaflet-icon bg-transparent border-0',
    iconSize: [pinSize, pinSize],
    iconAnchor: [pinSize / 2, pinSize / 2],
  });
}

const userIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#4ad1ff;border:3px solid #100f46;box-shadow:0 0 0 6px rgba(74,209,255,0.25)"></div>`,
  className: 'custom-leaflet-icon bg-transparent border-0',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function geolocationErrorMessage(code: number) {
  switch (code) {
    case 1:
      return 'Permita o acesso à localização para coletar as estrelas.';
    case 2:
      return 'Localização indisponível agora. Aguarde um instante ou use Simular chegada (Dev).';
    case 3:
      return 'Demorou para obter sua posição. Tente ao ar livre ou aguarde mais um pouco.';
    default:
      return 'Não foi possível obter sua localização.';
  }
}

function MapFocus({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);

  return null;
}

export default function ItineraryScreen({
  constellationId,
  progress,
  onProgressChange,
  onSwitchRoadmap,
  onExploreMore,
  onBack,
  activeRoadmapIds,
}: ItineraryScreenProps) {
  const constellation = getConstellationById(constellationId)!;
  const ITINERARY = constellation.stops.map((stop) => ({
    ...stop,
    color: VARIANT_COLOR[stop.variant],
  }));

  const [roadmapStarted, setRoadmapStarted] = useState(progress.started);
  const [collectedCount, setCollectedCount] = useState(progress.collectedStopIds.length);
  const [activeStopIndex, setActiveStopIndex] = useState(progress.collectedStopIds.length);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [revealedOffer, setRevealedOffer] = useState<(typeof ITINERARY)[number] | null>(null);
  const prevCollectedRef = useRef(progress.collectedStopIds.length);

  useEffect(() => {
    setRoadmapStarted(progress.started);
    setCollectedCount(progress.collectedStopIds.length);
    setActiveStopIndex(progress.collectedStopIds.length);
    setUserLocation(null);
    setGpsError(null);
    setGpsLoading(false);
    setRevealedOffer(null);
    prevCollectedRef.current = progress.collectedStopIds.length;
  }, [constellationId, progress.started, progress.collectedStopIds.length]);

  useEffect(() => {
    if (collectedCount <= prevCollectedRef.current) return;

    const justCollected = constellation.stops[collectedCount - 1];
    if (justCollected?.sponsored && justCollected.sponsoredOffer) {
      setRevealedOffer({ ...justCollected, color: VARIANT_COLOR[justCollected.variant] });
    }

    prevCollectedRef.current = collectedCount;
  }, [collectedCount, constellation.stops]);

  const pathPositions: [number, number][] = ITINERARY.map((item) => [item.lat, item.lng]);
  const activeStop = ITINERARY[activeStopIndex] ?? null;
  const alreadyComplete = isRoadmapComplete(progress, ITINERARY.length);
  const allCollected = alreadyComplete || (roadmapStarted && collectedCount >= ITINERARY.length);

  const pushProgress = useCallback(
    (collected: number, started: boolean, markComplete = false) => {
      onProgressChange({
        ...progress,
        started,
        collectedStopIds: ITINERARY.slice(0, collected).map((s) => s.id),
        completedAt: markComplete ? new Date().toISOString() : progress.completedAt,
      });
    },
    [ITINERARY, onProgressChange, progress],
  );

  const handleStopFeedback = useCallback(
    (stopId: number, feedback: PlaceFeedback) => {
      onProgressChange({
        ...progress,
        stopFeedback: {
          ...progress.stopFeedback,
          [stopId]: feedback,
        },
      });
    },
    [onProgressChange, progress],
  );

  const handleRouteFeedback = useCallback(
    (feedback: PlaceFeedback) => {
      onProgressChange({
        ...progress,
        routeFeedback: feedback,
      });
    },
    [onProgressChange, progress],
  );

  const distanceToActive = useMemo(() => {
    if (!userLocation || !activeStop) return null;
    return haversineMeters(userLocation.lat, userLocation.lng, activeStop.lat, activeStop.lng);
  }, [userLocation, activeStop]);

  const canCollectAtActiveStop =
    roadmapStarted &&
    !allCollected &&
    activeStopIndex === collectedCount &&
    distanceToActive !== null &&
    distanceToActive <= PROXIMITY_METERS;

  const handleCollectActiveStop = useCallback(() => {
    if (!activeStop || activeStopIndex !== collectedCount || !userLocation) return;

    const distance = haversineMeters(
      userLocation.lat,
      userLocation.lng,
      activeStop.lat,
      activeStop.lng,
    );
    if (distance > PROXIMITY_METERS) return;

    const nextCollected = collectedCount + 1;
    const completed = nextCollected >= ITINERARY.length;
    setCollectedCount(nextCollected);
    pushProgress(nextCollected, true, completed);

    if (nextCollected < ITINERARY.length) {
      setActiveStopIndex(nextCollected);
    }
  }, [
    activeStop,
    activeStopIndex,
    collectedCount,
    userLocation,
    ITINERARY.length,
    pushProgress,
  ]);

  const getStopState = useCallback(
    (index: number) => {
      if (!roadmapStarted) return { filled: true, focused: false };
      if (index < collectedCount) return { filled: true, focused: false };
      if (index === activeStopIndex) return { filled: false, focused: true };
      return { filled: false, focused: false };
    },
    [roadmapStarted, collectedCount, activeStopIndex],
  );

  const handleStartRoadmap = () => {
    setRoadmapStarted(true);
    if (!progress.started) {
      setActiveStopIndex(0);
      setCollectedCount(0);
      pushProgress(0, true);
    }
    setGpsError(null);
    setGpsLoading(true);
  };

  const simulateArrival = () => {
    if (!activeStop) return;
    setUserLocation({ lat: activeStop.lat, lng: activeStop.lng });
    setGpsLoading(false);
    setGpsError(null);
  };

  useEffect(() => {
    if (!roadmapStarted || allCollected) return;

    if (!navigator.geolocation) {
      setGpsError('Seu dispositivo não suporta geolocalização.');
      setGpsLoading(false);
      return;
    }

    let cancelled = false;
    let hasFix = false;
    const preferHighAccuracy = window.matchMedia('(max-width: 767px)').matches;

    const onSuccess = (position: GeolocationPosition) => {
      if (cancelled) return;
      hasFix = true;
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setGpsLoading(false);
      setGpsError(null);
    };

    const onError = (error: GeolocationPositionError) => {
      if (cancelled) return;

      if (error.code === error.PERMISSION_DENIED) {
        setGpsLoading(false);
        setGpsError(geolocationErrorMessage(error.code));
        return;
      }

      if (hasFix) return;

      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (fallbackError) => {
          if (cancelled || hasFix) return;
          setGpsLoading(false);
          setGpsError(geolocationErrorMessage(fallbackError.code));
        },
        { enableHighAccuracy: false, maximumAge: 120000, timeout: 12000 },
      );
    };

    setGpsLoading(true);
    setGpsError(null);

    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      { enableHighAccuracy: preferHighAccuracy, maximumAge: 15000, timeout: 20000 },
    );

    return () => {
      cancelled = true;
      navigator.geolocation.clearWatch(watchId);
    };
  }, [roadmapStarted, allCollected]);

  const mapCenter: [number, number] = roadmapStarted && activeStop
    ? [activeStop.lat, activeStop.lng]
    : [-5.78, -35.2];
  const mapZoom = roadmapStarted ? 14 : 11;

  if (allCollected) {
    const points = calculateRoadmapPoints(ITINERARY.length, ITINERARY.length, true);
    return (
      <ConstellationComplete
        roadmapName={constellation.roadmapTitle}
        constellationName={constellation.name}
        stops={ITINERARY}
        starsCollected={ITINERARY.length}
        totalStars={ITINERARY.length}
        pointsEarned={points.total}
        starPoints={points.starPoints}
        completionBonus={points.bonus}
        onExploreMore={onExploreMore}
        routeFeedback={progress.routeFeedback}
        onRouteFeedback={handleRouteFeedback}
      />
    );
  }

  return (
    <div
      className="h-full w-full relative overflow-x-hidden flex flex-col md:flex-row"
      style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-primary)' }}
    >
      <div className="stars ep-starfield absolute inset-0 opacity-40 pointer-events-none fixed" />

      {/* Left side: Itinerary list */}
      <div className="w-full md:w-1/2 relative z-10 md:overflow-y-auto" style={{ maxHeight: '100%' }}>
        <div className="w-full max-w-6xl mx-auto px-6 py-8 pb-20 md:px-8 md:pb-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 mb-6 -ml-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:opacity-80"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500 }}
          >
            <ArrowLeft size={18} style={{ color: 'var(--accent)' }} />
            Explorar
          </button>

          {activeRoadmapIds.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activeRoadmapIds.map((id) => {
                const c = getConstellationById(id);
                if (!c) return null;
                const isActive = id === constellationId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSwitchRoadmap(id)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-opacity"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-soft)' : 'var(--surface-card)',
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {c.name.replace('Constelação ', '').replace('Brilho ', '')}
                  </button>
                );
              })}
            </div>
          )}

          <header className="mb-8 md:mb-10">
            <p
              className="mb-2 uppercase tracking-widest"
              style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.16em' }}
            >
              Para hoje
            </p>
            <h1
              className="mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--weight-bold)',
                lineHeight: 'var(--leading-tight)',
                color: 'var(--text-primary)',
              }}
            >
              {constellation.roadmapTitle.replace(/^Roteiro /, 'Roteiro: ')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)' }}>
              {roadmapStarted
                ? 'Aproxime-se da estrela em destaque para coletá-la'
                : 'Pronto para começar a coletar estrelas?'}
            </p>
          </header>

          {constellation.guidedTour && (
            <TourGuidePanel
              guidedTour={constellation.guidedTour}
              routeName={constellation.roadmapTitle}
            />
          )}

          {roadmapStarted && !allCollected && activeStop && (
            <div
              className="mb-8 p-4 rounded-xl border text-center"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--accent)',
                color: 'var(--text-primary)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Próxima parada: {activeStop.title}
              </p>
              {gpsLoading && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 6 }}>
                  Obtendo sua localização…
                </p>
              )}
              {gpsError && (
                <p style={{ color: '#ff6b5e', fontSize: 'var(--text-sm)', marginTop: 6 }}>
                  {gpsError}
                </p>
              )}
              {!gpsLoading && !gpsError && distanceToActive !== null && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 6 }}>
                  {canCollectAtActiveStop
                    ? 'Você chegou! Toque em Coletar estrela no card abaixo.'
                    : `Você está a ${formatDistance(distanceToActive)} — chegue a ${PROXIMITY_METERS} m para coletar`}
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <div
              className="absolute left-4 md:left-5 top-5 bottom-5 border-l border-dashed pointer-events-none z-0"
              style={{ borderColor: 'var(--accent)', opacity: 0.45 }}
            />

            <div className="space-y-10 relative z-10">
              {ITINERARY.map((item, index) => {
                const { filled, focused } = getStopState(index);
                const isUpcoming = roadmapStarted && index > activeStopIndex && index >= collectedCount;

                return (
                  <div
                    key={item.id}
                    className="relative pl-12 md:pl-14 transition-opacity duration-300"
                    style={{ opacity: isUpcoming ? 0.55 : 1 }}
                  >
                    <div className="absolute left-4 md:left-5 top-3 -translate-x-1/2 z-10 flex items-center justify-center">
                      <MapPin
                        variant={item.variant}
                        size={focused ? 38 : 32}
                        filled={filled}
                        focused={focused}
                        sponsored={item.sponsored}
                      />
                    </div>

                    <div
                      className="p-5 rounded-2xl border transition-all duration-300"
                      style={{
                        backgroundColor: item.sponsored ? 'rgba(255, 200, 87, 0.04)' : 'var(--surface-card)',
                        borderColor: item.sponsored
                          ? focused
                            ? '#ffc857'
                            : 'rgba(255, 200, 87, 0.45)'
                          : focused
                            ? 'var(--accent)'
                            : 'var(--border-subtle)',
                        boxShadow: item.sponsored
                          ? focused
                            ? '0 0 28px rgba(255, 200, 87, 0.25)'
                            : '0 0 16px rgba(255, 200, 87, 0.1)'
                          : focused
                            ? 'var(--glow-sm)'
                            : 'var(--shadow-md)',
                        transform: focused ? 'translateY(-2px)' : undefined,
                      }}
                    >
                      {item.sponsored && (
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                          style={{
                            backgroundColor: 'rgba(255, 200, 87, 0.12)',
                            color: '#ffc857',
                            border: '1px solid rgba(255, 200, 87, 0.45)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          <Sparkles size={12} />
                          Estrela Patrocinada
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <div
                          className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: 'var(--surface-base)',
                            color: item.color,
                            border: `1px solid ${item.color}40`,
                          }}
                        >
                          {item.time}
                        </div>
                        {roadmapStarted && filled && index < collectedCount && (
                          <span
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: 'var(--mare)' }}
                          >
                            Coletada
                          </span>
                        )}
                        {focused && (
                          <span
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: 'var(--accent)' }}
                          >
                            Agora
                          </span>
                        )}
                      </div>
                      <h3
                        className="mb-2"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--weight-bold)',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: 'var(--text-sm)',
                          lineHeight: 'var(--leading-relaxed)',
                        }}
                      >
                        {item.description}
                      </p>
                      {focused && index === activeStopIndex && canCollectAtActiveStop && (
                        <button
                          type="button"
                          onClick={handleCollectActiveStop}
                          className="mt-4 w-full py-3 rounded-full font-semibold cursor-pointer transition-all duration-200 hover:scale-[1.02] inline-flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: item.sponsored ? '#ffc857' : 'var(--accent)',
                            color: item.sponsored ? '#100f46' : 'var(--text-on-accent)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            boxShadow: item.sponsored
                              ? '0 0 16px rgba(255, 200, 87, 0.35)'
                              : 'var(--glow-sm)',
                          }}
                        >
                          <Star size={16} fill="currentColor" />
                          Coletar estrela
                        </button>
                      )}
                      {item.sponsored && item.sponsoredOffer && roadmapStarted && index < collectedCount && (
                        <SponsoredOfferPanel
                          venueName={item.title}
                          offer={item.sponsoredOffer}
                          variant="compact"
                        />
                      )}
                      {item.sponsored && item.sponsoredOffer && (!roadmapStarted || index >= collectedCount) && (
                        <p
                          className="mt-3 px-3 py-2 rounded-lg"
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: '#ffc857',
                            backgroundColor: 'rgba(255, 200, 87, 0.08)',
                            border: '1px dashed rgba(255, 200, 87, 0.3)',
                          }}
                        >
                          Colete para desbloquear: {item.sponsoredOffer.discountLabel} — {item.sponsoredOffer.title.toLowerCase()}
                        </p>
                      )}
                      {roadmapStarted && index < collectedCount && (
                        <StarFeedbackForm
                          targetLabel={item.title}
                          variant="stop"
                          existing={progress.stopFeedback?.[item.id]}
                          onSubmit={(feedback) => handleStopFeedback(item.id, feedback)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!roadmapStarted ? (
            <button
              onClick={handleStartRoadmap}
              className="w-full mt-12 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-on-accent)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              {progress.collectedStopIds.length > 0 ? 'Continuar Roteiro' : 'Iniciar Roteiro'}
            </button>
          ) : (
            <p
              className="mt-12 text-center"
              style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}
            >
              {allCollected
                ? 'Parabéns! Você completou o roteiro.'
                : `${collectedCount} de ${ITINERARY.length} estrelas coletadas`}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Interactive Map canvas */}
      <div
        className="w-full md:w-1/2 h-[50vh] md:h-auto relative border-t md:border-t-0 md:border-l z-0"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--map-canvas)' }}
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
          zoomControl={false}
        >
          <MapFocus center={mapCenter} zoom={mapZoom} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <Polyline
            positions={pathPositions}
            pathOptions={{
              color: '#f8de22',
              weight: 2,
              dashArray: '6, 10',
              opacity: 0.55,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {ITINERARY.map((item, index) => {
            const { filled, focused } = getStopState(index);
            return (
              <Marker
                key={`${item.id}-${filled}-${focused}`}
                position={[item.lat, item.lng]}
                icon={createIcon(item.variant, filled, focused, item.sponsored)}
                zIndexOffset={focused ? 1000 : index}
              />
            );
          })}

          {roadmapStarted && activeStop && !allCollected && (
            <Circle
              center={[activeStop.lat, activeStop.lng]}
              radius={PROXIMITY_METERS}
              pathOptions={{
                color: '#f8de22',
                weight: 1,
                dashArray: '4, 6',
                fillColor: '#f8de22',
                fillOpacity: 0.08,
              }}
            />
          )}

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} zIndexOffset={2000} />
          )}
        </MapContainer>
      </div>

      {import.meta.env.DEV && roadmapStarted && !allCollected && activeStop && (
        <button
          type="button"
          onClick={simulateArrival}
          className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 px-3 py-3 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 max-w-[4.5rem] text-center leading-tight"
          style={{
            backgroundColor: 'var(--surface-card)',
            color: 'var(--text-secondary)',
            border: '1px dashed var(--border-default)',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          Simular chegada (Dev)
        </button>
      )}

      {revealedOffer?.sponsoredOffer && (
        <SponsoredOfferModal
          venueName={revealedOffer.title}
          offer={revealedOffer.sponsoredOffer}
          onClose={() => setRevealedOffer(null)}
        />
      )}
    </div>
  );
}
