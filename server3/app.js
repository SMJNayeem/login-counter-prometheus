const express = require('express');
const promClient = require('prom-client');
const app = express();
const port = process.env.PORT || 3003;

const requestCount = new promClient.Counter({
  name: 'request_count',
  help: 'The total number of requests'
});

app.get('/login', (req, res) => {
  requestCount.inc();
  res.send('Login endpoint');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
