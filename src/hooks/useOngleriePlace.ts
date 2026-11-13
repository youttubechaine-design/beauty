import {useEffect, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import {GOOGLE_MAPS_PLACE_URL} from '../data/services';
import type {
  OngleriePlaceData,
  PlacePhotoItem,
  PlaceReviewItem,
} from '../types/salon';

interface UseOngleriePlaceResult {
  placeData: OngleriePlaceData | null;
  loading: boolean;
  error: string | null;
}

const DEFAULT_FALLBACK_QUERY = "L'ONGLERIE MOBILE Treichville Abidjan";

function isQuotaError(err: unknown): boolean {
  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : String(err);
  const status =
    typeof err === 'object' && err !== null && 'status' in err
      ? String((err as {status: unknown}).status)
      : '';
  return (
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('OVER_QUERY_LIMIT') ||
    message.includes('OverQuotaMapError') ||
    message.includes('429') ||
    status === 'RESOURCE_EXHAUSTED' ||
    status === 'OVER_QUERY_LIMIT' ||
    status === '429'
  );
}

export function useOngleriePlace(): UseOngleriePlaceResult {
  const placesLib = useMapsLibrary('places');
  const [placeData, setPlaceData] = useState<OngleriePlaceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBusinessFromGoogleMaps() {
      if (!placesLib) return;

      setLoading(true);
      setError(null);

      try {
        const request: google.maps.places.SearchByTextRequest & {
          internalUsageAttributionIds?: string[];
        } = {
          textQuery: DEFAULT_FALLBACK_QUERY,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'regularOpeningHours',
            'nationalPhoneNumber',
            'internationalPhoneNumber',
            'photos',
            'reviews',
            'googleMapsURI',
            'businessStatus',
          ],
          locationBias: {lat: 5.3005, lng: -4.0065},
          language: 'fr',
          region: 'CI',
          maxResultCount: 3,
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        };

        const {places} = await placesLib.Place.searchByText(request);

        if (cancelled) return;

        if (!places || places.length === 0) {
          setError(
            "La fiche Google Maps n'a pas pu être récupérée pour le moment."
          );
          setLoading(false);
          return;
        }

        const matchedPlace =
          places.find((p) =>
            (p.displayName ?? '').toLowerCase().includes('onglerie')
          ) ?? places[0];

        // Compute open status cleanly if method exists on regularOpeningHours
        let isOpenNow: boolean | null = null;
        try {
          if (typeof matchedPlace.isOpen === 'function') {
            isOpenNow = (await matchedPlace.isOpen()) ?? null;
          }
        } catch {
          isOpenNow = null;
        }

        const photos: PlacePhotoItem[] = (matchedPlace.photos ?? []).map(
          (photo, idx) => ({
            id: `gmp-photo-${idx}`,
            thumbUri: photo.getURI({maxWidth: 900, maxHeight: 700}),
            fullUri: photo.getURI({maxWidth: 1600, maxHeight: 1200}),
            widthPx: photo.widthPx ?? 1200,
            heightPx: photo.heightPx ?? 900,
            googleMapsURI: photo.googleMapsURI ?? null,
            attributions: (photo.authorAttributions ?? []).map((attr) => ({
              displayName: attr.displayName || 'Contributeur Google Maps',
              uri: attr.uri ?? null,
              photoURI: attr.photoURI ?? null,
            })),
          })
        );

        const reviews: PlaceReviewItem[] = (matchedPlace.reviews ?? [])
          .filter((r) => Boolean(r.text || r.rating))
          .map((review, idx) => ({
            id: `gmp-review-${idx}`,
            authorName: review.authorAttribution?.displayName || 'Client Google',
            authorUri: review.authorAttribution?.uri ?? null,
            authorPhotoUri: review.authorAttribution?.photoURI ?? null,
            rating: review.rating ?? null,
            text: review.text ?? '',
            relativePublishTimeDescription:
              review.relativePublishTimeDescription ?? '',
          }));

        const loc = matchedPlace.location;
        const coordinates =
          loc && typeof loc.lat === 'function' && typeof loc.lng === 'function'
            ? {lat: loc.lat(), lng: loc.lng()}
            : null;

        setPlaceData({
          id: matchedPlace.id,
          displayName:
            matchedPlace.displayName || "L’ONGLERIE MOBILE Treichville",
          formattedAddress:
            matchedPlace.formattedAddress || 'Treichville, Abidjan, Côte d’Ivoire',
          location: coordinates,
          rating: matchedPlace.rating ?? null,
          userRatingCount: matchedPlace.userRatingCount ?? null,
          nationalPhoneNumber: matchedPlace.nationalPhoneNumber ?? null,
          internationalPhoneNumber:
            matchedPlace.internationalPhoneNumber ?? null,
          weekdayDescriptions:
            matchedPlace.regularOpeningHours?.weekdayDescriptions ?? [],
          isOpenNow,
          googleMapsURI: matchedPlace.googleMapsURI || GOOGLE_MAPS_PLACE_URL,
          businessStatus: matchedPlace.businessStatus
            ? String(matchedPlace.businessStatus)
            : null,
          photos,
          reviews,
        });
      } catch (err) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setError(
          "Impossible de charger les données en direct depuis Google Maps."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchBusinessFromGoogleMaps();

    return () => {
      cancelled = true;
    };
  }, [placesLib]);

  return {placeData, loading, error};
}
