# Smoke Radar QA Checklist

## Build

- Render deploy is green.
- `https://smoke-radar-app.onrender.com/trends` returns Hebrew trend data.
- Local Expo starts with `npx expo start --lan -c`.
- Internal Android APK build installs on a physical phone.

## Core Flow

- Home opens without white or blue flashes.
- Radar shows trends and the info explanation.
- "תנו לי לבחור את הנתח" opens dropdowns in this order: כבש/טלה, עוף, בקר.
- Selected cut continues correctly to recipe, pitmaster, and butcher flows.

## Recipe

- Recipe generation works with OpenAI in real mode.
- Recipe respects cut, cooking method, seasoning, effort, and kosher choice.
- Ingredients include weights and quantities.
- Shopping checklist toggles correctly.
- Shopping list shares to WhatsApp.
- Saved recipe appears under "המתכונים שלי".

## Butchers

- Location permission prompt appears on a clean install.
- Nearby butchers are returned from Google Places.
- Butchers are sorted by rating + rating count, with distance as a tie breaker.
- "פתחו מפה" opens the selected butcher in maps.

## RTL / Layout

- Hebrew text is right-aligned or centered intentionally.
- Bottom navigation buttons do not cover app buttons.
- Long recipe text wraps without clipping.
- Back navigation has no white flash.
