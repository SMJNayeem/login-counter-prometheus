const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/alert', (req, res) => {
  const alerts = req.body.alerts;
  alerts.forEach(alert => {
    console.log(`Alert: ${alert.labels.alertname}`);
    console.log(`Summary: ${alert.annotations.summary}`);
    console.log(`Description: ${alert.annotations.description}`);
    console.log('-----');
  });
  res.status(200).send('Alert received');
});

app.listen(PORT, () => {
  console.log(`Alert service is running on port ${PORT}`);
});