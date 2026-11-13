import {useCallback, useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, X} from 'lucide-react';
import type {PlacePhotoItem} from '../types/salon';
import {ResilientImage} from './ResilientImage';

interface GoogleMapsGalleryProps {
  photos: PlacePhotoItem[];
  placeName: string;
  googleMapsURI: string;
  loading: boolean;
}

export function GoogleMapsGallery({
  photos,
  placeName,
  googleMapsURI,
  loading,
}: GoogleMapsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % photos.length
    );
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, handleClose, handlePrev, handleNext]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <section
      id="galerie"
      className="py-20 lg:py-28 border-t border-black/8 bg-[#F4F2EF]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs tracking-widest uppercase text-[#5E2334] font-semibold mb-3">
              Galerie Officielle Google Maps
            </p>
            <h2
              className="font-serif text-3xl md:text-4xl font-semibold text-[#161414] leading-tight"
              style={{textWrap: 'balance'}}
            >
              Nos réalisations publiées sur Google Maps
            </h2>
          </div>

          <a
            href={googleMapsURI}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#161414] hover:text-[#5E2334] border-b border-[#161414]/30 hover:border-[#5E2334] pb-1 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <span>Voir toutes les photos sur Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 aspect-[16/10] bg-[#E7E3DE] animate-pulse rounded-lg" />
            <div className="grid grid-rows-2 gap-5">
              <div className="aspect-[4/3] bg-[#E7E3DE] animate-pulse rounded-lg" />
              <div className="aspect-[4/3] bg-[#E7E3DE] animate-pulse rounded-lg" />
            </div>
          </div>
        ) : photos.length === 0 ? (
          <div className="border border-black/10 bg-white/70 rounded-lg p-10 text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-[#5E2334]/70 mb-3" strokeWidth={1.5} />
            <p className="text-base font-medium text-[#161414] mb-2">
              Photos disponibles sur la fiche Google Maps de l’établissement
            </p>
            <p className="text-sm text-[#57524E] max-w-lg mx-auto mb-6">
              Consultez directement les réalisations et clichés récents publiés sur la page Google Maps de {placeName}.
            </p>
            <a
              href={googleMapsURI}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5E2334] text-white text-sm font-medium rounded-lg hover:bg-[#4B1B29] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ouvrir la galerie Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {photos.map((photo, index) => {
              const isLead = index === 0 && photos.length >= 3;
              const primaryAttr = photo.attributions[0];
              return (
                <figure
                  key={photo.id}
                  className={`group relative overflow-hidden rounded-lg border border-black/8 bg-white ${
                    isLead ? 'sm:col-span-2 sm:row-span-2' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="block w-full h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E2334]"
                    aria-label={`Agrandir la photo ${index + 1} de ${placeName}`}
                  >
                    <div
                      className={`w-full overflow-hidden bg-[#ECE8E3] ${
                        isLead ? 'aspect-[4/3] h-full' : 'aspect-[4/3]'
                      }`}
                    >
                      <ResilientImage
                        src={photo.thumbUri}
                        alt={`${placeName} — Photo Google Maps ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        fallbackTitle={placeName}
                      />
                    </div>
                  </button>

                  {primaryAttr && (
                    <figcaption className="px-3.5 py-2.5 bg-white border-t border-black/6 flex items-center justify-between gap-2 text-xs text-[#57524E]">
                      <span className="truncate">
                        Photo :{' '}
                        {primaryAttr.uri ? (
                          <a
                            href={primaryAttr.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#161414]"
                          >
                            {primaryAttr.displayName}
                          </a>
                        ) : (
                          <span>{primaryAttr.displayName}</span>
                        )}
                      </span>
                      <span className="text-[11px] text-[#7A746E] tabular-nums shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu photo Google Maps"
          onClick={handleClose}
        >
          <div
            className="relative max-w-5xl w-full bg-[#161414] rounded-lg overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 text-white">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium">{placeName}</span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <span className="text-white/70 tabular-nums">
                  {activeIndex + 1} / {photos.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white rounded-md focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Fermer l’aperçu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[72vh]">
              <img
                src={activePhoto.fullUri}
                alt={`${placeName} — Photo ${activeIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto object-contain"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/85 transition-colors focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/85 transition-colors focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 bg-[#161414] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/75">
              <div>
                {activePhoto.attributions.length > 0 ? (
                  <span>
                    Crédit photo Google Maps :{' '}
                    {activePhoto.attributions[0].uri ? (
                      <a
                        href={activePhoto.attributions[0].uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-white hover:text-white/90"
                      >
                        {activePhoto.attributions[0].displayName}
                      </a>
                    ) : (
                      <span className="text-white">
                        {activePhoto.attributions[0].displayName}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>Source : Google Maps</span>
                )}
              </div>

              <a
                href={activePhoto.googleMapsURI || googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white underline hover:text-white/80 whitespace-nowrap"
              >
                <span>Voir sur Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
