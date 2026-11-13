export interface PlacePhotoAttribution {
  displayName: string;
  uri: string | null;
  photoURI: string | null;
}

export interface PlacePhotoItem {
  id: string;
  thumbUri: string;
  fullUri: string;
  widthPx: number;
  heightPx: number;
  googleMapsURI: string | null;
  attributions: PlacePhotoAttribution[];
}

export interface PlaceReviewItem {
  id: string;
  authorName: string;
  authorUri: string | null;
  authorPhotoUri: string | null;
  rating: number | null;
  text: string;
  relativePublishTimeDescription: string;
}

export interface OngleriePlaceData {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: {lat: number; lng: number} | null;
  rating: number | null;
  userRatingCount: number | null;
  nationalPhoneNumber: string | null;
  internationalPhoneNumber: string | null;
  weekdayDescriptions: string[];
  isOpenNow: boolean | null;
  googleMapsURI: string;
  businessStatus: string | null;
  photos: PlacePhotoItem[];
  reviews: PlaceReviewItem[];
}

export type ServiceCategory = 'all' | 'hands' | 'feet' | 'mobile';

export interface SalonService {
  id: string;
  number: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  duration: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  imageAlt: string;
}
