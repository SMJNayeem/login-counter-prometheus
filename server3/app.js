const express = require('express');
const client = require('prom-client');
const app = express();
const port = process.env.PORT || 3003;

const register = new client.Registry();
const counter = new client.Counter({
  name: 'request_count',
  help: 'Number of requests received',
});

register.registerMetric(counter);

app.get('/login', (req, res) => {
  counter.inc();
  res.send('Login endpoint');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/scale', (req, res) => {
  // Simulate scaling logic
  res.send('Scaling endpoint hit');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
