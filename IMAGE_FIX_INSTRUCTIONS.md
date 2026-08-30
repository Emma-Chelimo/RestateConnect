# Image Fix — Setup Instructions

## What was wrong
`via.placeholder.com`, used for every property image and the profile avatar, has become
unreliable/largely dead as a free service (SSL issues, connection resets, intermittent outages).
That's why images stopped loading — not a bug in the app's code.

## What changed

1. **New file**: `src/utils/imageHelper.js`
   A small `resolveImage()` helper that accepts either a remote URL (string) or a locally
   bundled image (`require(...)`) and returns the correct format for React Native's `<Image>`
   component either way. This means you can freely mix local and remote images per property,
   and switching a property from placeholder to a real local photo later needs **no other code
   changes** — just update the `images` array in `properties.js`.

2. **Updated files** (all now use `resolveImage()`):
   - `src/components/PropertyCard.js`
   - `src/screens/PropertyDetailScreen.js`
   - `src/data/properties.js` — swapped `via.placeholder.com` URLs for `picsum.photos`
     (currently reliable, random stock photos — still just a placeholder, not real listings)
   - `src/screens/ProfileScreen.js` — swapped the dead avatar URL for `ui-avatars.com`
     (generates a clean initials-based avatar, e.g. "JD" for John Doe)

Your custom colors (`#0d1a2c` background, `#8080dd` Profile header) were preserved exactly as
you had them — only the image-loading logic changed.

## Copy these files into your project

```
RestateConnect/src/
├── utils/imageHelper.js          ← NEW FILE
├── components/PropertyCard.js    ← replace
├── data/properties.js            ← replace
└── screens/
    ├── PropertyDetailScreen.js   ← replace
    └── ProfileScreen.js          ← replace
```

No new npm packages needed — this is pure JS/logic, no rebuild of native code required.
Just save the files and Fast Refresh should pick it up immediately in your debug build.

## When you're ready to add real apartment photos

1. Create a folder: `src/assets/images/`
2. Drop your photos in there, e.g. `villa-main.jpg`, `villa-interior.jpg`
3. In `properties.js`, change that property's `images` array from URL strings to:
   ```js
   images: [
     require('../assets/images/villa-main.jpg'),
     require('../assets/images/villa-interior.jpg'),
   ],
   ```
4. Save — no other file needs to change, since `resolveImage()` already handles both formats.

A couple of practical tips for when you get to that step:
- Keep individual photos under ~500KB–1MB each (resize/compress first) so the app doesn't get
  bloated — bundled images add directly to your APK size, unlike remote URLs.
- JPG is usually smaller than PNG for real photos; save PNG for icons/graphics with transparency.
- If you eventually have many properties with photos, consider hosting images on a service like
  Firebase Storage or Cloudinary instead of bundling — keeps your APK size down and lets you
  update photos without rebuilding the app. Happy to help set that up when you're there.
