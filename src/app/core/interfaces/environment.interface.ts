export interface Environment {
  production: boolean;
  app: {
    url: string;
  };
  apis: Record<string, { url: string }>;
  mapbox: {
    style: string;
    accessToken: string;
  }
}
