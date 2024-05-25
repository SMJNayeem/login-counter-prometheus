const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.post('/alert', (req, res) => {
  console.log('Alert received:', req.body);
  res.status(200).send('Alert received');
});

app.listen(port, () => {
  console.log(`Alert service running on port ${port}`);
});
