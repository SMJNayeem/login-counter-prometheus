const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/alert', (req, res) => {
  const alerts = req.body.alerts;
  for (const alert of alerts) {
    console.log('Received alert:', alert);
    // Process the alert here
  }
  res.status(200).send('Alert received');
});

app.listen(PORT, () => {
  console.log(`Alert service is running on port ${PORT}`);
});