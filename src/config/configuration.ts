export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    version: '1.0.0',
  },
  jwt: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      exp: process.env.ACCESS_TOKEN_EXPIRATION,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      exp: process.env.REFRESH_TOKEN_EXPIRATION,
    },
  },
  swagger: {
    title: 'Simple Blog API Docs',
    description:
      'This provides comprehensive documentation for all blog services API',
    path: 'api-docs',
    theme: 'dark',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});
