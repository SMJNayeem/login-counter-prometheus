const express = require('express');
const promClient = require('prom-client');
const { setupMetricsEndpoint } = require('./utils/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up metrics endpoint
const scaleCounter = new promClient.Counter({
  name: 'scale_requests_total',
  help: 'Total number of requests to the /scale endpoint',
});

setupMetricsEndpoint(app, scaleCounter);

// Set up routes
app.get('/login', (req, res) => {
  // Handle login request
  res.send('Login successful');
});

app.get('/scale', (req, res) => {
  scaleCounter.inc(); // Increment the /scale counter
  res.send('Scaling operation successful');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// // Set up metrics endpoint using prom-client HTTP registry
// app.get('/metrics', promClient.register.metrics());

// setupMetricsEndpoint(app); // Call setupMetrics after app definition