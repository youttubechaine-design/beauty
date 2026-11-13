# Return Photos of a Specific Place

This sub-workflow details how to retrieve and display high-quality photographic
content and mandatory author attributions for a specific place using the `Place`
class in the Maps JavaScript API (`places` library).

## Prerequisites

1.  **Google Maps JavaScript API Loaded**: The Maps JavaScript API must be
    loaded via the dynamic library import bootstrap script in your HTML.
2.  **Places API (New) Enabled**: Ensure the **Places API (New)** is enabled in
    your Google Cloud Console project.
3.  **Place Identifier (`id`)**: To fetch photos directly for a specific place,
    you need a valid Place ID (e.g., `'ChIJydSuSkkUkFQRsqhB-cEtYnw'`).
    Alternatively, `Place` instances can be obtained from
    `Place.searchByText()`, `Place.searchNearby()`, or `AutocompleteSuggestion`.

--------------------------------------------------------------------------------

## Compliance & Terms of Service Rules

When working with Place Photos, you **must** adhere to the following Google Maps
Platform Terms of Service requirements:

1.  **Mandatory Author Attributions**: Whenever you display a photo, you must
    clearly display the author attributions (`photo.authorAttributions`)
    associated with that photo.
2.  **No Caching**: Do **not** cache photo URIs or the photos themselves. Always
    retrieve photo data and generate URIs dynamically from a fresh `Place`
    object. See Section 3.2.3(b) (No Caching) of the
    [Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms/).
3.  **EEA Developers**: If your billing address is in the European Economic
    Area, the
    [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea)
    apply.

--------------------------------------------------------------------------------

## Core Workflow: Fetching and Rendering Place Photos

### Step 1: Import the Places Library and Instantiate `Place`

Load the `places` library dynamically using
`google.maps.importLibrary('places')` and initialize a `Place` instance with
your target Place ID.

### Step 2: Request the `photos` Field

Call `place.fetchFields()` and include `'photos'` in the `fields` array. This
populates `place.photos` with an array of up to 10 `google.maps.places.Photo`
objects.

### Step 3: Generate Resized Image URIs with `getURI()`

On any returned `Photo` object, call
`photo.getURI(options?: google.maps.places.PhotoOptions)` to get the source
image URL:

-   Pass `{ maxHeight: number }` and/or `{ maxWidth: number }` to resize the
    image while preserving its original aspect ratio.
-   If both `maxHeight` and `maxWidth` are provided, the service scales the
    image to fit within the smaller of the two constraints.
-   If no options are passed (`photo.getURI()`), the full-size image is
    returned.

### Step 4: Render the Image and Author Attributions

Extract the `authorAttributions` array from the `Photo` instance and render the
author's `displayName` and `uri` alongside the image.

--------------------------------------------------------------------------------

## API Reference Summary

### `google.maps.places.Photo` Properties & Methods

| Property / Method    | Type                                          | Description |
| :------------------- | :-------------------------------------------- | :---------- |
| `getURI(options?)`   | `(options?: { maxHeight?: number, maxWidth?:  | Returns the |
:                      : number }) => string`                          : URI for the :
:                      :                                               : photo       :
:                      :                                               : image,      :
:                      :                                               : resized     :
:                      :                                               : according   :
:                      :                                               : to          :
:                      :                                               : `maxHeight` :
:                      :                                               : and/or      :
:                      :                                               : `maxWidth`. :
| `authorAttributions` | `Array<google.maps.places.AuthorAttribution>` | Array of    |
:                      :                                               : required    :
:                      :                                               : author      :
:                      :                                               : attribution :
:                      :                                               : objects for :
:                      :                                               : the photo.  :
| `heightPx`           | `number`                                      | The maximum |
:                      :                                               : height of   :
:                      :                                               : the         :
:                      :                                               : original    :
:                      :                                               : photo in    :
:                      :                                               : pixels.     :
| `widthPx`            | `number`                                      | The maximum |
:                      :                                               : width of    :
:                      :                                               : the         :
:                      :                                               : original    :
:                      :                                               : photo in    :
:                      :                                               : pixels.     :
| `flagContentURI`     | `string \| null`                              | A link      |
:                      :                                               : where users :
:                      :                                               : can flag a  :
:                      :                                               : problem     :
:                      :                                               : with the    :
:                      :                                               : photo.      :
| `googleMapsURI`      | `string \| null`                              | A link to   |
:                      :                                               : view the    :
:                      :                                               : photo       :
:                      :                                               : directly on :
:                      :                                               : Google      :
:                      :                                               : Maps.       :

### `google.maps.places.AuthorAttribution` Properties

Property      | Type             | Description
:------------ | :--------------- | :---------------------------------------
`displayName` | `string`         | The author's display name.
`uri`         | `string \| null` | URI to the author's Google Maps profile.
`photoURI`    | `string \| null` | URI to the author's profile photo.

--------------------------------------------------------------------------------

## Code Examples

### 1. Minimal Snippet: Fetch and Display the First Photo with Attribution

```javascript
async function displayFirstPlacePhoto(placeId, containerElementId) {
  const { Place } = await google.maps.importLibrary('places');
  const container = document.getElementById(containerElementId);

  // 1. Create a Place instance using the Place ID
  const place = new Place({ id: placeId });

  // 2. Fetch the photos and displayName fields
  await place.fetchFields({
    fields: ['displayName', 'photos'],
  });

  if (!place.photos || place.photos.length === 0) {
    container.textContent = 'No photos available for this location.';
    return;
  }

  const firstPhoto = place.photos[0];

  // 3. Create and append the image element using getURI()
  const img = document.createElement('img');
  img.src = firstPhoto.getURI({ maxHeight: 400 });
  img.alt = `Photo of ${place.displayName || 'place'}`;
  container.appendChild(img);

  // 4. Render required author attributions
  if (firstPhoto.authorAttributions && firstPhoto.authorAttributions.length > 0) {
    const attribution = firstPhoto.authorAttributions[0];
    const attrLink = document.createElement('a');
    attrLink.textContent = `Photo by ${attribution.displayName}`;
    if (attribution.uri) {
      attrLink.href = attribution.uri;
      attrLink.target = '_blank';
      attrLink.rel = 'noopener noreferrer';
    }
    container.appendChild(attrLink);
  }
}
```

--------------------------------------------------------------------------------

### 2. Complete Production Example: Interactive City Photo Viewer

This complete example demonstrates loading the Maps JavaScript API, fetching
`displayName`, `photos`, and `editorialSummary` from the `Place` class, handling
errors gracefully, and rendering an image with overlaid author attribution.

#### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Place Photos</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" type="text/css" href="./style.css" />
    <script type="module" src="./index.js"></script>
    <script>
      (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "YOUR_GOOGLE_MAPS_API_KEY"
      });
    </script>
  </head>
  <body>
    <div id="container">
      <div class="place-overview">
        <div id="info">
          <h1 id="heading"></h1>
          <div id="summary"></div>
        </div>
        <button id="randomize-btn">Random City Photo</button>
      </div>
      <div id="expanded-image"></div>
    </div>
  </body>
</html>
```

#### `index.ts` (TypeScript)

```typescript
const CITIES = [
  { name: 'New York', id: 'ChIJOwg_06VPwokRYv534QaPC8g' },
  { name: 'London', id: 'ChIJdd4hrwug2EcRmSrV3Vo6llI' },
  { name: 'Paris', id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' },
  { name: 'Tokyo', id: 'ChIJ51cu8IcbXWARiRtXIothAS4' },
  { name: 'Rome', id: 'ChIJu46S-ZZhLxMROG5lkwZ3D7k' },
];

async function init() {
  const { Place } = (await google.maps.importLibrary(
    'places'
  )) as google.maps.PlacesLibrary;

  const heading = document.getElementById('heading')!;
  const summary = document.getElementById('summary')!;
  const expandedImageDiv = document.getElementById('expanded-image')!;
  const randomizeBtn = document.getElementById(
    'randomize-btn'
  ) as HTMLButtonElement;

  async function showRandomCityPhoto() {
    randomizeBtn.disabled = true;

    // Pick a random city
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];

    try {
      const place = new Place({ id: city.id });
      await place.fetchFields({
        fields: ['displayName', 'photos', 'editorialSummary'],
      });

      heading.textContent = place.displayName ?? city.name;
      summary.textContent = place.editorialSummary ?? '';
      expandedImageDiv.innerHTML = '';

      if (place.photos && place.photos.length > 0) {
        // Pick one of the first 10 photos
        const maxPhotos = Math.min(10, place.photos.length);
        const randomIndex = Math.floor(Math.random() * maxPhotos);
        const photo = place.photos[randomIndex];

        const img = document.createElement('img');
        img.alt = `Photo of ${place.displayName ?? city.name}`;
        img.src = photo.getURI({ maxHeight: 800 });
        expandedImageDiv.appendChild(img);

        if (photo.authorAttributions.length) {
          expandedImageDiv.appendChild(
            createAttribution(photo.authorAttributions[0])
          );
        }
      } else {
        expandedImageDiv.textContent = 'No photos available for this location.';
      }
    } catch (error) {
      console.error('Failed to fetch place details:', error);
      summary.textContent = 'Failed to load data.';
    }

    // Re-enable button after 2 seconds
    setTimeout(() => {
      randomizeBtn.disabled = false;
    }, 2000);
  }

  // Helper function to create attribution element.
  function createAttribution(
    attribution: google.maps.places.AuthorAttribution
  ) {
    const attributionLabel = document.createElement('a');
    attributionLabel.classList.add('attribution-label');
    attributionLabel.textContent = attribution.displayName;
    if (attribution.uri) {
      attributionLabel.href = attribution.uri;
    }
    attributionLabel.target = '_blank';
    attributionLabel.rel = 'noopener noreferrer';
    return attributionLabel;
  }

  randomizeBtn.addEventListener('click', () => void showRandomCityPhoto());

  // Initial load
  void showRandomCityPhoto();
}

void init();
```

#### `style.css`

```css
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1e1e2f, #252540);
  display: flex;
  align-items: center;
  justify-content: center;
}

#container {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 900px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  color: white;
}

.place-overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 40px;
}

#heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#summary {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #cbd5e1;
}

#expanded-image {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

#expanded-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

#randomize-btn {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(90deg, #4f46e5, #3b82f6);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  align-self: flex-start;
}

#randomize-btn:disabled {
  background: #475569;
  cursor: not-allowed;
  opacity: 0.7;
}

.attribution-label {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-decoration: none;
  backdrop-filter: blur(4px);
}

.attribution-label:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
```

--------------------------------------------------------------------------------

### 3. Alternative Pattern: Thumbnail Gallery with Click-to-Expand

Based on the official
[Google Maps JS Samples (`samples/place-photos/index.ts`)](https://github.com/googlemaps/js-samples/blob/HEAD/samples/place-photos/index.ts?utm_campaign=gmp_git_agentskills_v1),
you can iterate over all returned `place.photos` to build a thumbnail gallery
where clicking a thumbnail displays a larger version and updates the attribution
link:

```typescript
async function initGallery() {
  const { Place } = (await google.maps.importLibrary(
    'places'
  )) as google.maps.PlacesLibrary;

  const place = new Place({
    id: 'ChIJydSuSkkUkFQRsqhB-cEtYnw', // Woodland Park Zoo, Seattle WA
  });

  await place.fetchFields({
    fields: ['displayName', 'photos', 'editorialSummary'],
  });

  const gallery = document.getElementById('gallery') as HTMLElement;
  const expandedImageDiv = document.getElementById('expanded-image') as HTMLElement;

  function createAttribution(attributions: google.maps.places.AuthorAttribution[]) {
    const attributionLabel = document.createElement('a');
    attributionLabel.classList.add('attribution-label');
    if (attributions && attributions.length > 0) {
      attributionLabel.textContent = attributions[0].displayName;
      if (attributions[0].uri) {
        attributionLabel.href = attributions[0].uri;
      }
      attributionLabel.target = '_blank';
      attributionLabel.rel = 'noopener noreferrer';
    }
    return attributionLabel;
  }

  if (place.photos && place.photos.length > 0) {
    // Render thumbnails in the gallery
    place.photos.forEach((photo) => {
      const thumbImg = document.createElement('img');
      thumbImg.src = photo.getURI({ maxHeight: 380 });
      thumbImg.alt = `Thumbnail of ${place.displayName}`;

      thumbImg.addEventListener('click', (event) => {
        event.preventDefault();
        const expandedImage = document.createElement('img');
        expandedImage.src = photo.getURI({ maxHeight: 800 });
        expandedImage.alt = `Photo of ${place.displayName}`;

        expandedImageDiv.innerHTML = '';
        expandedImageDiv.appendChild(expandedImage);
        expandedImageDiv.appendChild(createAttribution(photo.authorAttributions));
      });

      gallery.appendChild(thumbImg);
    });

    // Display the first photo by default
    const firstImg = document.createElement('img');
    firstImg.src = place.photos[0].getURI();
    firstImg.alt = `Photo of ${place.displayName}`;
    expandedImageDiv.appendChild(firstImg);
    expandedImageDiv.appendChild(
      createAttribution(place.photos[0].authorAttributions)
    );
  }
}
```

--------------------------------------------------------------------------------

### 4. Alternative Pattern: Retrieving Photos via Text or Nearby Search

If you do not have a Place ID up front, you can request the `'photos'` field
directly in `Place.searchByText()` or `Place.searchNearby()` requests:

```typescript
async function searchAndShowPhotos() {
  const { Place } = (await google.maps.importLibrary(
    'places'
  )) as google.maps.PlacesLibrary;

  const request = {
    textQuery: 'Woodland Park Zoo Seattle',
    fields: ['displayName', 'photos'],
    maxResultCount: 1,
    internalUsageAttributionIds: ['gmp_git_agentskills_v1'],
  };

  const { places } = await Place.searchByText(request);

  if (places.length > 0 && places[0].photos && places[0].photos.length > 0) {
    const photo = places[0].photos[0];
    const imageUrl = photo.getURI({ maxWidth: 600 });
    const attribution = photo.authorAttributions[0];
    console.log('Photo URI:', imageUrl, 'Author:', attribution?.displayName);
  }
}
```

--------------------------------------------------------------------------------

### 5. Alternative Pattern: Places UI Kit Web Components (`<gmp-place-media>`)

If you are using the Places UI Kit Web Components (`<gmp-place-details>` or
`<gmp-place-details-compact>`), you can declaratively render place photos with
built-in lightbox support and attribution using `<gmp-place-media>` and
`<gmp-place-attribution>` inside `<gmp-place-content-config>`:

```html
<gmp-place-details internal-usage-attribution-ids="gmp_git_agentskills_v1">
  <gmp-place-details-place-request
    place="ChIJydSuSkkUkFQRsqhB-cEtYnw"
  ></gmp-place-details-place-request>
  <gmp-place-content-config>
    <gmp-place-media lightbox-preferred preferred-size="MEDIUM"></gmp-place-media>
    <gmp-place-attribution></gmp-place-attribution>
  </gmp-place-content-config>
</gmp-place-details>
```
