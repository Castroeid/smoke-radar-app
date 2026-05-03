# Smoke Radar API

Small mock backend for the Smoke Radar Expo app.

## Local run

```bash
cd server
npm start
```

The server listens on `http://localhost:3000` unless `PORT` is set.

## Endpoints

- `GET /health`
- `GET /trends`
- `POST /recipes/generate`
- `POST /expert/ask`
- `GET /butchers/nearby`

## Render setup

Create a new Render Web Service from this GitHub repository.

- Root Directory: `server`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

After Render deploys, copy the service URL into the app `.env`:

```env
EXPO_PUBLIC_SMOKE_RADAR_API_MODE=real
EXPO_PUBLIC_SMOKE_RADAR_API_URL=https://your-render-service.onrender.com
```

Do not put private API keys in the Expo app. Add them to Render environment variables when real integrations are added.
