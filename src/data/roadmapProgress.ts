export type ShineFeedback = 'shine' | 'fade';

export type PlaceFeedback = {
  shine: ShineFeedback;
  comment?: string;
  submittedAt: string;
};

export type RoadmapProgress = {
  started: boolean;
  collectedStopIds: number[];
  completedAt?: string;
  stopFeedback?: Record<number, PlaceFeedback>;
  routeFeedback?: PlaceFeedback;
};

export const SHINE_FEEDBACK_LABELS: Record<
  ShineFeedback,
  { action: string; hint: string; submitted: string; color: string; softBg: string; border: string }
> = {
  shine: {
    action: 'Acender brilho',
    hint: 'O lugar brilhou — recomendo',
    submitted: 'Brilho aceso',
    color: 'var(--accent)',
    softBg: 'rgba(248, 222, 34, 0.1)',
    border: 'var(--accent)',
  },
  fade: {
    action: 'Apagar brilho',
    hint: 'Perdeu o brilho — não valeu',
    submitted: 'Brilho apagado',
    color: 'var(--text-muted)',
    softBg: 'rgba(100, 100, 140, 0.12)',
    border: 'var(--border-default)',
  },
};

export const STAR_POINTS = 50;
export const COMPLETION_BONUS = 100;

export function createEmptyProgress(): RoadmapProgress {
  return { started: false, collectedStopIds: [], stopFeedback: {} };
}

export function isRoadmapComplete(progress: RoadmapProgress, totalStops: number) {
  return progress.started && progress.collectedStopIds.length >= totalStops;
}

export function calculateRoadmapPoints(collected: number, total: number, completed: boolean) {
  const starPoints = collected * STAR_POINTS;
  const bonus = completed && collected >= total ? COMPLETION_BONUS : 0;
  return { starPoints, bonus, total: starPoints + bonus };
}

export function getExplorerLevel(totalStars: number) {
  if (totalStars >= 15) return 'Estrela Guia';
  if (totalStars >= 8) return 'Explorador';
  if (totalStars >= 3) return 'Viajante';
  return 'Curioso';
}

export function sumTotalStars(progressByRoadmap: Record<string, RoadmapProgress>) {
  return Object.values(progressByRoadmap).reduce((sum, p) => sum + p.collectedStopIds.length, 0);
}

export function sumTotalPoints(
  progressByRoadmap: Record<string, RoadmapProgress>,
  stopCounts: Record<string, number>,
) {
  return Object.entries(progressByRoadmap).reduce((sum, [id, progress]) => {
    const total = stopCounts[id] ?? 0;
    const completed = isRoadmapComplete(progress, total);
    return sum + calculateRoadmapPoints(progress.collectedStopIds.length, total, completed).total;
  }, 0);
}

export function countShineFeedback(progressByRoadmap: Record<string, RoadmapProgress>) {
  let shine = 0;
  let fade = 0;

  for (const progress of Object.values(progressByRoadmap)) {
    for (const fb of Object.values(progress.stopFeedback ?? {})) {
      if (fb.shine === 'shine') shine += 1;
      else fade += 1;
    }
    if (progress.routeFeedback) {
      if (progress.routeFeedback.shine === 'shine') shine += 1;
      else fade += 1;
    }
  }

  return { shine, fade };
}
