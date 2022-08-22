import { Environment } from '@core/interfaces/environment.interface';

export const environment: Environment = {
  app: { url: 'http://localhost:4200' },
  production: false,
  apis: {
    main: { url: 'https://app.smartapartmentdata.com' }
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiaHNudG5nciIsImEiOiJjbDExd25mbHUwMWgyM29vNDh6Ynl0MmhkIn0.85K1gBW7oGaDNB3awdZ_KQ',
    style: 'https://api.maptiler.com/maps/eef16200-c4cc-4285-9370-c71ca24bb42d/style.json?key=CH1cYDfxBV9ZBu1lHGqh'
  }
};
