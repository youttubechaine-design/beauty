import type {SalonService} from '../types/salon';

export const GOOGLE_MAPS_PLACE_URL =
  'https://www.google.com/maps/place/L%E2%80%99ONGLERIE+MOBILE+Treichville/data=!4m2!3m1!1s0x0:0x440bf07ea5bda73e';

export const HERO_FALLBACK_IMAGE =
  '/src/assets/images/hero_nail_atelier_1794565865539.jpg';

export const SALON_SERVICES: SalonService[] = [
  {
    id: 'gel-capsules',
    number: '01',
    title: 'Pose Gel, Capsules & Gainage',
    category: 'hands',
    categoryLabel: 'Mains & Gel',
    duration: '60 – 90 min',
    description:
      'Architecture soignée de l’ongle en gel sculpté ou capsules adaptées à votre morphologie, avec préparation douce des cuticules et finition brillante longue tenue.',
    highlights: ['Formes amande, ballerine ou carré court', 'Renfort sur ongles naturels'],
    imageUrl: '/src/assets/images/service_gel_sculpting_1794565865020.jpg',
    imageAlt: 'Mains manucurées avec pose gel champagne et finition brillante',
  },
  {
    id: 'semi-permanent-art',
    number: '02',
    title: 'Vernis Semi-Permanent & Nail Art',
    category: 'hands',
    categoryLabel: 'Mains & Gel',
    duration: '45 – 60 min',
    description:
      'Couleur uniforme, French manucure fine ou motifs sur mesure réalisés à la main avec des pigments haute brillance sans écaillage.',
    highlights: ['French classique ou bicolore', 'Dépose soignée sans agresser la plaque'],
    imageUrl: '/src/assets/images/hero_nail_atelier_1794565865539.jpg',
    imageAlt: 'Manucure French grenat sur ongles en amande posés sur pierre travertin',
  },
  {
    id: 'beaute-pieds-spa',
    number: '03',
    title: 'Beauté des Pieds & Pédicure Spa',
    category: 'feet',
    categoryLabel: 'Beauté des Pieds',
    duration: '50 – 75 min',
    description:
      'Soin complet des pieds incluant bain tiède, travail minutieux des talons et cuticules, gommage nourrissant et pose de vernis classique ou semi-permanent.',
    highlights: ['Hydratation aux huiles botaniques', 'Hygiène rigoureuse et matériel stérilisé'],
    imageUrl: '/src/assets/images/service_pedicure_care_1794565866409.jpg',
    imageAlt: 'Soin pédicure spa avec serviettes ivoire et huiles botaniques',
  },
  {
    id: 'onglerie-mobile-domicile',
    number: '04',
    title: 'Service Onglerie Mobile à Domicile',
    category: 'mobile',
    categoryLabel: 'Service Mobile',
    duration: 'Sur rendez-vous',
    description:
      'L’expertise de l’atelier directement chez vous ou sur votre lieu de travail à Treichville et dans les communes d’Abidjan, avec tout le matériel professionnel.',
    highlights: ['Intervention à domicile, hôtel ou bureau', 'Créneaux individuels ou événements privés'],
    imageUrl: '/src/assets/images/service_gel_sculpting_1794565865020.jpg',
    imageAlt: 'Prestation d’onglerie professionnelle mobile à Abidjan',
  },
];
