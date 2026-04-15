export interface AppConfig {
  port: number;
  corsOrigins: string[];
  globalPrefix: string;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env['PORT'] ?? '4000', 10),
  corsOrigins: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000,http://localhost:3001').split(','),
  globalPrefix: 'api',
};
