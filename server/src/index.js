import { createSmokeRadarServer } from './server.js';

const port = Number(process.env.PORT ?? 3000);
const server = createSmokeRadarServer();

server.listen(port, () => {
  console.log(`Smoke Radar API listening on port ${port}`);
});
