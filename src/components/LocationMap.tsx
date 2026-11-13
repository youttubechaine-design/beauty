import {useCallback, useState} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
} from '@vis.gl/react-google-maps';
import {ExternalLink, MapPin} from 'lucide-react';

interface LocationMapProps {
  location: {lat: number; lng: number} | null;
  displayName: string;
  formattedAddress: string;
  googleMapsURI: string;
  loading: boolean;
}

function useAdvancedMarkerRef() {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const refCallback = useCallback(
    (m: google.maps.marker.AdvancedMarkerElement | null) => {
      setMarker(m);
    },
    []
  );

  return [refCallback, marker] as const;
}

export function LocationMap({
  location,
  displayName,
  formattedAddress,
  googleMapsURI,
  loading,
}: LocationMapProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  if (loading) {
    return (
      <div className="w-full h-full min-h-[420px] rounded-lg bg-[#E7E3DE] animate-pulse flex items-center justify-center text-sm text-[#57524E]">
        Chargement de la carte Google Maps…
      </div>
    );
  }

  if (!location) {
    return (
      <div className="w-full h-full min-h-[420px] rounded-lg border border-black/10 bg-[#F2F0EE] p-8 flex flex-col items-center justify-center text-center">
        <MapPin className="w-8 h-8 text-[#5E2334] mb-3" strokeWidth={1.5} />
        <p className="font-serif text-2xl font-semibold text-[#161414] mb-2">
          {displayName}
        </p>
        <p className="text-sm text-[#57524E] max-w-sm mb-6">
          Retrouvez la position exacte et l’itinéraire en temps réel directement sur Google Maps.
        </p>
        <a
          href={googleMapsURI}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5E2334] text-white text-sm font-medium rounded-lg hover:bg-[#4B1B29] transition-colors whitespace-nowrap"
        >
          <span>Ouvrir dans Google Maps</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[420px] rounded-lg overflow-hidden border border-black/10 relative">
      <GoogleMap
        defaultCenter={location}
        center={location}
        defaultZoom={16}
        mapId="DEMO_MAP_ID"
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full min-h-[420px]"
      >
        <AdvancedMarker
          ref={markerRef}
          position={location}
          title={displayName}
          onClick={() => setInfoOpen(true)}
        >
          <Pin
            background="#5E2334"
            borderColor="#FFFFFF"
            glyphColor="#FFFFFF"
          />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 max-w-[240px] font-sans text-[#161414]">
              <p className="font-semibold text-sm mb-1">{displayName}</p>
              <p className="text-xs text-[#57524E] mb-2 leading-relaxed">
                {formattedAddress}
              </p>
              <a
                href={googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5E2334] underline"
              >
                <span>Itinéraire Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
