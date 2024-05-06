export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    version: '1.0.0',
  },
  swagger: {
    title: 'Simple Blog API Docs',
    description:
      'This provides comprehensive documentation for all blog services API',
    path: 'api-docs',
    theme: 'dark',
  },
});
