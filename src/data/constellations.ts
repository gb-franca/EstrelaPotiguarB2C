export type CategoryId = 'praia' | 'cultural' | 'natureza' | 'pet' | 'gastronomia' | 'aventura';

export type SponsoredOffer = {
  title: string;
  description: string;
  discountLabel: string;
  code: string;
  validUntil?: string;
};

export type TourGuide = {
  name: string;
  role: string;
  bio: string;
  whatsapp: string;
  phone: string;
  languages: string[];
  priceFrom?: string;
};

export type GuidedTour = {
  guide: TourGuide;
  note: string;
};

export type RoadmapStop = {
  id: number;
  time: string;
  title: string;
  description: string;
  variant: 'accent' | 'aurora' | 'mare';
  lat: number;
  lng: number;
  sponsored?: boolean;
  sponsoredOffer?: SponsoredOffer;
};

export type ConstellationRoadmap = {
  id: string;
  name: string;
  roadmapTitle: string;
  category: CategoryId;
  categoryLabel: string;
  description: string;
  duration: string;
  featured?: boolean;
  curated?: boolean;
  guidedTour?: GuidedTour;
  stops: RoadmapStop[];
};

export const CONSTELLATIONS: ConstellationRoadmap[] = [
  {
    id: 'reis-magos',
    name: 'Constelação dos Reis Magos',
    roadmapTitle: 'Roteiro Cidade dos Reis Magos',
    category: 'cultural',
    categoryLabel: 'Cultural',
    description: 'Forte, história e mar — o roteiro clássico que revela a origem de Natal.',
    duration: '1 dia',
    featured: true,
    curated: true,
    guidedTour: {
      note: 'Este roteiro histórico é ideal com um guia local — combine horário e grupo antes de partir.',
      guide: {
        name: 'Ana Clara Potiguar',
        role: 'Guia de turismo · história de Natal',
        bio: 'Historiadora e guia credenciada. Conduz passeios pelo Forte dos Reis Magos, centro histórico e litoral norte há mais de 10 anos.',
        whatsapp: '5584999123456',
        phone: '(84) 99912-3456',
        languages: ['Português', 'Inglês', 'Espanhol'],
        priceFrom: 'R$ 120/pessoa',
      },
    },
    stops: [
      {
        id: 1,
        time: '09:00',
        title: 'Morro do Careca',
        description: 'Comece na praia de Ponta Negra, cartão-postal de Natal.',
        variant: 'accent',
        lat: -5.8841,
        lng: -35.1652,
      },
      {
        id: 2,
        time: '12:30',
        title: 'Forte dos Reis Magos',
        description: 'Fortaleza histórica no encontro do rio Potengi com o mar.',
        variant: 'aurora',
        lat: -5.7565,
        lng: -35.1946,
      },
      {
        id: 3,
        time: '15:30',
        title: 'Dunas de Genipabu',
        description: 'Buggy e pôr do sol entre dunas e lagoas no litoral norte.',
        variant: 'mare',
        lat: -5.7051,
        lng: -35.2312,
      },
    ],
  },
  {
    id: 'sol-mar',
    name: 'Brilho das Praias',
    roadmapTitle: 'Roteiro Brilho das Praias',
    category: 'praia',
    categoryLabel: 'Sol e Praia',
    description: 'Ponta Negra, Areia Preta e águas mornas para quem quer sol o dia inteiro.',
    duration: '1 dia',
    curated: true,
    stops: [
      {
        id: 1,
        time: '08:00',
        title: 'Ponta Negra',
        description: 'Amanhecer e caminhada na orla mais famosa da cidade.',
        variant: 'accent',
        lat: -5.8841,
        lng: -35.1652,
      },
      {
        id: 2,
        time: '10:30',
        title: 'Praia de Copacabana',
        description: 'Águas calmas e quiosques à beira-mar no litoral sul.',
        variant: 'accent',
        lat: -5.8678,
        lng: -35.1715,
      },
      {
        id: 3,
        time: '13:00',
        title: 'Via Costeira',
        description: 'Trecho de coqueiros e mar entre Ponta Negra e Areia Preta.',
        variant: 'accent',
        lat: -5.822,
        lng: -35.182,
      },
      {
        id: 4,
        time: '16:00',
        title: 'Areia Preta',
        description: 'Praia urbana com mar calmo e vista para o Morro do Careca.',
        variant: 'accent',
        lat: -5.7695,
        lng: -35.1992,
      },
    ],
  },
  {
    id: 'verde-dunas',
    name: 'Verde & Dunas',
    roadmapTitle: 'Roteiro Verde & Dunas',
    category: 'natureza',
    categoryLabel: 'Natureza',
    description: 'Genipabu, lagoas e trilhas leves entre dunas, vento e paisagem viva.',
    duration: '2 dias',
    curated: true,
    stops: [
      {
        id: 1,
        time: '08:30',
        title: 'Parque das Dunas',
        description: 'Maior parque urbano de dunas da América Latina, trilhas e fauna.',
        variant: 'mare',
        lat: -5.8533,
        lng: -35.1867,
      },
      {
        id: 2,
        time: '11:00',
        title: 'Lagoa de Jacumã',
        description: 'Tirolesa e lagoa de águas doces entre dunas e vegetação.',
        variant: 'mare',
        lat: -5.6508,
        lng: -35.2395,
      },
      {
        id: 3,
        time: '14:00',
        title: 'Genipabu',
        description: 'Dunas móveis e passeio de buggy com vista para o oceano.',
        variant: 'mare',
        lat: -5.7051,
        lng: -35.2312,
      },
      {
        id: 4,
        time: '09:00',
        title: 'Praia de Pipa',
        description: 'Falésias, golfinhos e natureza preservada no litoral sul.',
        variant: 'mare',
        lat: -6.2264,
        lng: -35.0519,
      },
      {
        id: 5,
        time: '15:00',
        title: 'Barra de Cunhaú',
        description: 'Encontro do rio com o mar em paisagem de mangue e areia.',
        variant: 'mare',
        lat: -6.3433,
        lng: -35.0417,
      },
    ],
  },
  {
    id: 'pet-friendly',
    name: 'Patas na Areia',
    roadmapTitle: 'Roteiro Patas na Areia',
    category: 'pet',
    categoryLabel: 'Pet Friendly',
    description: 'Parques, calçadões e praias acolhedoras para viajar com seu melhor amigo.',
    duration: '1 dia',
    stops: [
      {
        id: 1,
        time: '09:00',
        title: 'Parque da Cidade',
        description: 'Área verde ampla e pet friendly no coração de Natal.',
        variant: 'accent',
        lat: -5.8114,
        lng: -35.2098,
      },
      {
        id: 2,
        time: '11:30',
        title: 'Praia de Barreira do Roxo',
        description: 'Praia extensa e tranquila, popular entre tutores locais.',
        variant: 'accent',
        lat: -5.7433,
        lng: -35.2083,
      },
      {
        id: 3,
        time: '14:00',
        title: 'Centro de Turismo',
        description: 'Calçadão sombreado para passeio com pets no centro histórico.',
        variant: 'accent',
        lat: -5.7835,
        lng: -35.2008,
      },
      {
        id: 4,
        time: '16:30',
        title: 'Praia do Meio',
        description: 'Orla central com quiosques e fácil acesso para cães.',
        variant: 'accent',
        lat: -5.775,
        lng: -35.197,
      },
    ],
  },
  {
    id: 'sabores-rn',
    name: 'Sabores do Potiguar',
    roadmapTitle: 'Roteiro Sabores do Potiguar',
    category: 'gastronomia',
    categoryLabel: 'Gastronomia',
    description: 'Frutos do mar, tapioca e botecos locais em um céu de sabores nordestinos.',
    duration: '1 dia',
    curated: true,
    stops: [
      {
        id: 1,
        time: '10:00',
        title: 'Ribeira do Potengi',
        description: 'Restaurantes às margens do rio com frutos do mar frescos.',
        variant: 'aurora',
        lat: -5.7892,
        lng: -35.2089,
      },
      {
        id: 2,
        time: '12:30',
        title: 'Mercado de Artesanato',
        description: 'Sabores locais, tapiocas e quitutes potiguares no centro.',
        variant: 'aurora',
        lat: -5.7958,
        lng: -35.2095,
      },
      {
        id: 3,
        time: '19:00',
        title: 'Camarões Restaurante',
        description: 'Referência potiguar desde 1989 — camarões, frutos do mar e porções generosas em Ponta Negra.',
        variant: 'aurora',
        lat: -5.8726,
        lng: -35.1806,
        sponsored: true,
        sponsoredOffer: {
          title: 'Jantar com desconto',
          description: '15% de desconto no jantar ao apresentar o código no Camarões Restaurante — válido no mesmo dia da visita pelo roteiro.',
          discountLabel: '15% OFF',
          code: 'ESTRELACAMAROES',
          validUntil: 'Válido no dia da coleta',
        },
      },
      {
        id: 4,
        time: '21:00',
        title: 'Ponta Negra Gastronômica',
        description: 'Sobremesa e drinks com vista para o mar na orla mais vibrante da cidade.',
        variant: 'aurora',
        lat: -5.8785,
        lng: -35.168,
      },
    ],
  },
  {
    id: 'aventura-litoral',
    name: 'Adrenalina do Litoral',
    roadmapTitle: 'Roteiro Adrenalina do Litoral',
    category: 'aventura',
    categoryLabel: 'Aventura',
    description: 'Buggy, skibunda e esportes ao ar livre para quem busca emoção no litoral norte.',
    duration: '1 dia',
    curated: true,
    stops: [
      {
        id: 1,
        time: '08:00',
        title: 'Genipabu — Buggy',
        description: 'Passeio radical pelas dunas com descidas em alta velocidade.',
        variant: 'mare',
        lat: -5.7051,
        lng: -35.2312,
      },
      {
        id: 2,
        time: '11:00',
        title: 'Skydive Natal',
        description: 'Salto de paraquedas com vista panorâmica do litoral potiguar.',
        variant: 'mare',
        lat: -5.9114,
        lng: -35.2483,
      },
      {
        id: 3,
        time: '14:30',
        title: 'Praia de Cotovelo',
        description: 'Surf, stand-up paddle e esportes aquáticos em mar cristalino.',
        variant: 'mare',
        lat: -5.9145,
        lng: -35.152,
      },
      {
        id: 4,
        time: '17:00',
        title: 'Auta da Torre',
        description: 'Tirolesa sobre o mar — uma das maiores do Brasil.',
        variant: 'mare',
        lat: -5.882,
        lng: -35.1645,
      },
    ],
  },
];

export function projectStopsToSvg(
  stops: Pick<RoadmapStop, 'lat' | 'lng'>[],
  width = 200,
  height = 80,
  padding = 18,
) {
  const lats = stops.map((s) => s.lat);
  const lngs = stops.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latSpan = maxLat - minLat || 0.001;
  const lngSpan = maxLng - minLng || 0.001;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  // Preserve aspect ratio so geographic shape isn't distorted
  const geoAspect = lngSpan / latSpan;
  const boxAspect = innerW / innerH;
  let drawW = innerW;
  let drawH = innerH;
  let offsetX = 0;
  let offsetY = 0;

  if (geoAspect > boxAspect) {
    drawH = innerW / geoAspect;
    offsetY = (innerH - drawH) / 2;
  } else {
    drawW = innerH * geoAspect;
    offsetX = (innerW - drawW) / 2;
  }

  return stops.map((stop) => ({
    x: padding + offsetX + ((stop.lng - minLng) / lngSpan) * drawW,
    y: padding + offsetY + ((maxLat - stop.lat) / latSpan) * drawH,
  }));
}

export function getConstellationById(id: string) {
  return CONSTELLATIONS.find((c) => c.id === id);
}

export function buildGuideWhatsAppUrl(guide: TourGuide, routeName: string) {
  const message = `Olá ${guide.name}! Vi o roteiro "${routeName}" no Estrela Potiguar e gostaria de saber sobre um passeio guiado.`;
  return `https://wa.me/${guide.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildGuidePhoneUrl(guide: TourGuide) {
  return `tel:+${guide.whatsapp}`;
}

export type UnlockedSponsoredOffer = {
  constellationId: string;
  constellationName: string;
  roadmapTitle: string;
  stop: RoadmapStop;
};

export type PendingSponsoredOffer = UnlockedSponsoredOffer;

export function getUnlockedSponsoredOffers(
  progressByRoadmap: Record<string, { collectedStopIds: number[] }>,
): UnlockedSponsoredOffer[] {
  const offers: UnlockedSponsoredOffer[] = [];

  for (const constellation of CONSTELLATIONS) {
    const progress = progressByRoadmap[constellation.id];
    if (!progress) continue;

    for (const stopId of progress.collectedStopIds) {
      const stop = constellation.stops.find((s) => s.id === stopId);
      if (stop?.sponsored && stop.sponsoredOffer) {
        offers.push({
          constellationId: constellation.id,
          constellationName: constellation.name,
          roadmapTitle: constellation.roadmapTitle,
          stop,
        });
      }
    }
  }

  return offers;
}

export function getPendingSponsoredOffers(
  progressByRoadmap: Record<string, { collectedStopIds: number[] }>,
): PendingSponsoredOffer[] {
  const pending: PendingSponsoredOffer[] = [];

  for (const constellation of CONSTELLATIONS) {
    const collected = new Set(progressByRoadmap[constellation.id]?.collectedStopIds ?? []);

    for (const stop of constellation.stops) {
      if (stop.sponsored && stop.sponsoredOffer && !collected.has(stop.id)) {
        pending.push({
          constellationId: constellation.id,
          constellationName: constellation.name,
          roadmapTitle: constellation.roadmapTitle,
          stop,
        });
      }
    }
  }

  return pending;
}
