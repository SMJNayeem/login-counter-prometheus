const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Received webhook payload:', payload);
  // Process the webhook payload here
  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Webhook service is running on port ${PORT}`);
});