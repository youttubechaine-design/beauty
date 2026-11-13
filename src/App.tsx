import {useEffect, useMemo, useState} from 'react';
import {APIProvider} from '@vis.gl/react-google-maps';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';
import {BookingForm} from './components/BookingForm';
import {GoogleMapsGallery} from './components/GoogleMapsGallery';
import {LocationMap} from './components/LocationMap';
import {ResilientImage} from './components/ResilientImage';
import {
  GOOGLE_MAPS_PLACE_URL,
  HERO_FALLBACK_IMAGE,
  SALON_SERVICES,
} from './data/services';
import {useOngleriePlace} from './hooks/useOngleriePlace';
import type {ServiceCategory} from './types/salon';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const CATEGORY_TABS: {id: ServiceCategory; label: string}[] = [
  {id: 'all', label: 'Toutes'},
  {id: 'hands', label: 'Mains & Gel'},
  {id: 'feet', label: 'Beauté des Pieds'},
  {id: 'mobile', label: 'Service Mobile'},
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}

function ShowcaseContent() {
  const {placeData, loading, error} = useOngleriePlace();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    SALON_SERVICES[0].id
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return SALON_SERVICES;
    return SALON_SERVICES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const placeName =
    placeData?.displayName || 'L’ONGLERIE MOBILE Treichville';
  const googleMapsURI = placeData?.googleMapsURI || GOOGLE_MAPS_PLACE_URL;
  const phoneDisplay =
    placeData?.internationalPhoneNumber || placeData?.nationalPhoneNumber || null;
  const heroGooglePhoto = placeData?.photos?.[0] ?? null;

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToSection('rendez-vous');
  };

  // Detect current day name in French to subtly highlight today's opening row
  const todayFrench = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fr-FR', {weekday: 'long'})
        .format(new Date())
        .toLowerCase();
    } catch {
      return '';
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#161414]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#F9F8F6]/95 backdrop-blur-sm border-b border-black/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#accueil"
            className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-[#161414] whitespace-nowrap shrink-0"
          >
            L’Onglerie Mobile
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Navigation principale"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57524E]"
          >
            <a
              href="#prestations"
              className="hover:text-[#161414] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Prestations
            </a>
            <a
              href="#galerie"
              className="hover:text-[#161414] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Galerie
            </a>
            <a
              href="#avis-horaires"
              className="hover:text-[#161414] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Avis &amp; Horaires
            </a>
            <a
              href="#localisation"
              className="hover:text-[#161414] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Localisation
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('rendez-vous')}
              className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-[#5E2334] rounded-lg hover:bg-[#4B1B29] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Prendre rendez-vous
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split Section */}
        <section id="accueil" className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#5E2334] font-semibold mb-4">
                  Treichville · Abidjan, Côte d’Ivoire
                </p>

                <h1
                  className="font-serif font-semibold text-[#161414] leading-[1.06] tracking-tight mb-6"
                  style={{
                    fontSize: 'clamp(2.35rem, 4.4vw, 3.85rem)',
                    textWrap: 'balance',
                  }}
                >
                  L’art du soin des ongles, en atelier ou à domicile.
                </h1>

                <p className="text-base md:text-lg text-[#57524E] leading-relaxed max-w-xl mb-8">
                  <strong>{placeName}</strong> vous accueille à Treichville et se déplace sur rendez-vous à Abidjan pour vos poses en gel, vernis semi-permanent, manucures et beautés des pieds.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <button
                    type="button"
                    onClick={() => scrollToSection('rendez-vous')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E2334] text-white text-sm font-medium rounded-lg hover:bg-[#4B1B29] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Prendre rendez-vous</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={googleMapsURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 border border-black/15 text-[#161414] text-sm font-medium rounded-lg hover:bg-[#F2F0EE] transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Voir sur Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Live Google Maps proof strip (unboxed text with typographic separators) */}
              <div className="pt-6 border-t border-black/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#57524E]">
                {loading ? (
                  <span className="text-xs text-[#7A746E]">
                    Synchronisation avec Google Maps en cours…
                  </span>
                ) : (
                  <>
                    {placeData?.rating !== null && placeData?.rating !== undefined && (
                      <div className="flex items-center gap-1.5 text-[#161414] font-medium tabular-nums">
                        <Star
                          className="w-4 h-4 text-[#9E6B55] fill-[#9E6B55]"
                          aria-hidden="true"
                        />
                        <span>{placeData.rating.toFixed(1)} / 5</span>
                        {placeData.userRatingCount !== null && (
                          <span className="text-[#57524E] font-normal">
                            ({placeData.userRatingCount} avis Google)
                          </span>
                        )}
                      </div>
                    )}

                    {placeData?.isOpenNow !== null && placeData?.isOpenNow !== undefined && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#161414]">
                          {placeData.isOpenNow
                            ? 'Ouvert actuellement'
                            : 'Fermé actuellement'}
                        </span>
                      </>
                    )}

                    {phoneDisplay && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={`tel:${phoneDisplay.replace(/\s+/g, '')}`}
                          className="hover:text-[#5E2334] transition-colors tabular-nums"
                        >
                          {phoneDisplay}
                        </a>
                      </>
                    )}

                    {!placeData && error && (
                      <span className="text-xs text-[#57524E]">
                        Fiche officielle disponible via le lien Google Maps ci-dessus.
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Hero Visual: Prioritizes real Google Maps Place Photo with crisp fallback */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 min-h-[340px] lg:min-h-[480px] rounded-lg overflow-hidden border border-black/10 bg-[#ECE8E3]">
                <ResilientImage
                  src={heroGooglePhoto?.fullUri || HERO_FALLBACK_IMAGE}
                  alt={
                    heroGooglePhoto
                      ? `${placeName} — Photo issue de Google Maps`
                      : 'Manucure French grenat réalisée sur pierre travertin'
                  }
                  className="w-full h-full object-cover"
                  fallbackTitle={placeName}
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                  <p className="text-xs font-medium tracking-wide text-white/90">
                    {heroGooglePhoto
                      ? 'Photo officielle · Fiche Google Maps'
                      : 'Soin des ongles · Atelier & Service Mobile'}
                  </p>
                  {heroGooglePhoto?.attributions?.[0] && (
                    <p className="text-[11px] text-white/75 mt-0.5">
                      Crédit photo :{' '}
                      {heroGooglePhoto.attributions[0].uri ? (
                        <a
                          href={heroGooglePhoto.attributions[0].uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-white"
                        >
                          {heroGooglePhoto.attributions[0].displayName}
                        </a>
                      ) : (
                        <span>{heroGooglePhoto.attributions[0].displayName}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Prestations & Savoir-Faire */}
        <section
          id="prestations"
          className="py-20 lg:py-28 border-t border-black/8 bg-white"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-xs tracking-widest uppercase text-[#5E2334] font-semibold mb-3">
                  Nos Prestations
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl font-semibold text-[#161414] leading-tight"
                  style={{textWrap: 'balance'}}
                >
                  Des soins précis pour les mains et les pieds
                </h2>
              </div>

              {/* Interactive filter tabs */}
              <div
                className="flex flex-wrap items-center gap-1 p-1 bg-[#F2F0EE] rounded-lg self-start md:self-auto"
                role="tablist"
                aria-label="Filtrer les prestations"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-[#161414] shadow-xs'
                          : 'text-[#57524E] hover:text-[#161414]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className="group border border-black/8 rounded-lg overflow-hidden bg-[#F9F8F6] flex flex-col"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#ECE8E3]">
                    <ResilientImage
                      src={service.imageUrl}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                      fallbackTitle={service.title}
                    />
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#57524E] mb-2">
                        <span>{service.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{service.duration}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-semibold text-[#161414] mb-3">
                        {service.number}. {service.title}
                      </h3>

                      <p className="text-sm text-[#57524E] leading-relaxed mb-5">
                        {service.description}
                      </p>

                      <ul className="space-y-1.5 text-xs text-[#57524E] mb-6 border-t border-black/8 pt-4">
                        {service.highlights.map((item) => (
                          <li key={item}>— {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleBookService(service.id)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#5E2334] hover:text-[#3F1521] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <span>Réserver ce soin</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Google Maps Photos Gallery */}
        <GoogleMapsGallery
          photos={placeData?.photos ?? []}
          placeName={placeName}
          googleMapsURI={googleMapsURI}
          loading={loading}
        />

        {/* Section 3: Reviews & Live Opening Hours */}
        <section
          id="avis-horaires"
          className="py-20 lg:py-28 border-t border-black/8 bg-white"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Reviews Column */}
              <div className="lg:col-span-7">
                <p className="text-xs tracking-widest uppercase text-[#5E2334] font-semibold mb-3">
                  Avis Clients Google Maps
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#161414]">
                    Retours de nos clientes
                  </h2>
                  {placeData?.rating !== null &&
                    placeData?.rating !== undefined && (
                      <div className="flex items-center gap-2 text-sm font-medium text-[#161414] tabular-nums">
                        <Star className="w-4 h-4 text-[#9E6B55] fill-[#9E6B55]" />
                        <span>
                          {placeData.rating.toFixed(1)} / 5
                          {placeData.userRatingCount
                            ? ` · ${placeData.userRatingCount} avis`
                            : ''}
                        </span>
                      </div>
                    )}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    <div className="h-28 bg-[#F2F0EE] animate-pulse rounded-lg" />
                    <div className="h-28 bg-[#F2F0EE] animate-pulse rounded-lg" />
                  </div>
                ) : placeData?.reviews && placeData.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {placeData.reviews.map((review) => (
                      <article
                        key={review.id}
                        className="p-6 rounded-lg border border-black/8 bg-[#F9F8F6]"
                      >
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {review.authorPhotoUri && (
                              <img
                                src={review.authorPhotoUri}
                                alt={review.authorName}
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded-full object-cover border border-black/10 shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#161414] truncate">
                                {review.authorUri ? (
                                  <a
                                    href={review.authorUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {review.authorName}
                                  </a>
                                ) : (
                                  review.authorName
                                )}
                              </p>
                              {review.relativePublishTimeDescription && (
                                <p className="text-xs text-[#7A746E]">
                                  {review.relativePublishTimeDescription}
                                </p>
                              )}
                            </div>
                          </div>

                          {review.rating !== null && (
                            <div className="flex items-center gap-1 text-xs font-semibold text-[#161414] tabular-nums shrink-0">
                              <Star className="w-3.5 h-3.5 text-[#9E6B55] fill-[#9E6B55]" />
                              <span>{review.rating}/5</span>
                            </div>
                          )}
                        </div>

                        {review.text && (
                          <p className="text-sm text-[#57524E] leading-relaxed">
                            {review.text}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-lg border border-black/8 bg-[#F9F8F6]">
                    <p className="text-sm text-[#57524E] mb-4">
                      Les avis clients vérifiés sont consultables directement sur la page Google Maps de {placeName}.
                    </p>
                    <a
                      href={googleMapsURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#5E2334] hover:underline"
                    >
                      <span>Consulter les avis sur Google Maps</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Practical Info & Opening Hours Column */}
              <div className="lg:col-span-5">
                <div className="border border-black/10 rounded-lg bg-[#F9F8F6] p-7 md:p-8">
                  <p className="text-xs tracking-widest uppercase text-[#5E2334] font-semibold mb-2">
                    Informations Pratiques
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#161414] mb-6">
                    Coordonnées &amp; Horaires
                  </h3>

                  <div className="space-y-5 text-sm border-b border-black/8 pb-6 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="w-4 h-4 text-[#5E2334] mt-0.5 shrink-0"
                        strokeWidth={1.75}
                      />
                      <div>
                        <p className="text-xs text-[#7A746E] mb-0.5">Adresse</p>
                        <p className="font-medium text-[#161414]">
                          {loading
                            ? 'Chargement…'
                            : placeData?.formattedAddress ||
                              'Treichville, Abidjan, Côte d’Ivoire'}
                        </p>
                      </div>
                    </div>

                    {phoneDisplay && (
                      <div className="flex items-start gap-3">
                        <Phone
                          className="w-4 h-4 text-[#5E2334] mt-0.5 shrink-0"
                          strokeWidth={1.75}
                        />
                        <div>
                          <p className="text-xs text-[#7A746E] mb-0.5">
                            Téléphone
                          </p>
                          <a
                            href={`tel:${phoneDisplay.replace(/\s+/g, '')}`}
                            className="font-medium text-[#161414] hover:text-[#5E2334] transition-colors tabular-nums"
                          >
                            {phoneDisplay}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Clock
                        className="w-4 h-4 text-[#5E2334] mt-0.5 shrink-0"
                        strokeWidth={1.75}
                      />
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs text-[#7A746E]">
                            Horaires d’ouverture
                          </p>
                          {placeData?.isOpenNow !== null &&
                            placeData?.isOpenNow !== undefined && (
                              <span className="text-xs font-semibold text-[#5E2334]">
                                {placeData.isOpenNow ? 'Ouvert' : 'Fermé'}
                              </span>
                            )}
                        </div>

                        {loading ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-[#E7E3DE] animate-pulse rounded w-3/4" />
                            <div className="h-4 bg-[#E7E3DE] animate-pulse rounded w-2/3" />
                          </div>
                        ) : placeData?.weekdayDescriptions &&
                          placeData.weekdayDescriptions.length > 0 ? (
                          <ul className="space-y-1.5 text-xs md:text-sm">
                            {placeData.weekdayDescriptions.map((line) => {
                              const isToday =
                                todayFrench &&
                                line.toLowerCase().startsWith(todayFrench);
                              return (
                                <li
                                  key={line}
                                  className={`py-1 px-2 -mx-2 rounded tabular-nums ${
                                    isToday
                                      ? 'bg-white font-semibold text-[#161414] border border-black/8'
                                      : 'text-[#57524E]'
                                  }`}
                                >
                                  {line}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#57524E]">
                            Consultez les horaires actualisés sur la fiche Google Maps.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={googleMapsURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-black/15 rounded-lg text-sm font-medium text-[#161414] hover:bg-white transition-colors whitespace-nowrap"
                  >
                    <span>Ouvrir la fiche Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Map & Booking Form */}
        <section
          id="localisation"
          className="py-20 lg:py-28 border-t border-black/8 bg-[#F4F2EF]"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs tracking-widest uppercase text-[#5E2334] font-semibold mb-3">
                Nous Trouver &amp; Réserver
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl font-semibold text-[#161414] leading-tight"
                style={{textWrap: 'balance'}}
              >
                Localisation à Treichville et prise de rendez-vous
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-6 flex flex-col">
                <LocationMap
                  location={placeData?.location ?? null}
                  displayName={placeName}
                  formattedAddress={
                    placeData?.formattedAddress ||
                    'Treichville, Abidjan, Côte d’Ivoire'
                  }
                  googleMapsURI={googleMapsURI}
                  loading={loading}
                />
              </div>

              <div id="rendez-vous" className="lg:col-span-6">
                <BookingForm
                  selectedServiceId={selectedServiceId}
                  phoneDisplay={phoneDisplay}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-black/8 bg-[#F9F8F6] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-lg font-semibold text-[#161414]">
              {placeName}
            </p>
            <p className="text-xs text-[#57524E] mt-1">
              {placeData?.formattedAddress ||
                'Treichville, Abidjan, Côte d’Ivoire'}{' '}
              · Soins en atelier et onglerie mobile
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#57524E]">
            <a
              href="#prestations"
              className="hover:text-[#161414] transition-colors whitespace-nowrap"
            >
              Prestations
            </a>
            <a
              href="#galerie"
              className="hover:text-[#161414] transition-colors whitespace-nowrap"
            >
              Galerie
            </a>
            <a
              href="#avis-horaires"
              className="hover:text-[#161414] transition-colors whitespace-nowrap"
            >
              Avis &amp; Horaires
            </a>
            <a
              href={googleMapsURI}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#161414] transition-colors whitespace-nowrap"
            >
              Google Maps
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-6 pt-5 border-t border-black/6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#7A746E]">
          <span>
            © {new Date().getFullYear()} {placeName}. Tous droits réservés.
          </span>
          <span>
            Cartes, photos et fiche établissement intégrées via Google Maps Platform.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const quotaBanner = quotaExceeded ? (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
      <span>
        Google Maps Platform quota reached. If you are the app owner, visit{' '}
        <a
          href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-950 hover:text-amber-800"
        >
          maps developer site
        </a>{' '}
        for instructions to update your account.
      </span>
    </div>
  ) : null;

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <>
        {quotaBanner}
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs text-center">
          Clé API Google Maps manquante. Activez Google Maps dans les paramètres pour charger la fiche, les photos et la carte en direct.
        </div>
        <ShowcaseContent />
      </>
    );
  }

  return (
    <>
      {quotaBanner}
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        language="fr"
        region="CI"
        libraries={['places', 'maps', 'marker', 'core']}
      >
        <ShowcaseContent />
      </APIProvider>
    </>
  );
}
