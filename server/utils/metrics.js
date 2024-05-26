const promClient = require('prom-client');

const requestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const setupMetricsEndpoint = (app, scaleCounter) => {
  app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
      const elapsed = process.hrtime(start);
      const elapsedMs = (elapsed[0] * 1000) + (elapsed[1] / 1000000);
      requestCounter.inc({
        method: req.method,
        route: req.route.path,
        status_code: res.statusCode,
      }, elapsedMs);
    });
    next();
  });

  app.get('/metrics', (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.send(promClient.register.metrics());
  });

  promClient.register.registerMetric(scaleCounter);
};

module.exports = { setupMetricsEndpoint };