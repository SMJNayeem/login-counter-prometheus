const express = require('express');
const Docker = require('node-docker-api').Docker;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/alert', (req, res) => {
  const alerts = req.body.alerts;
  alerts.forEach(async (alert) => {
    if (alert.labels.alertname === 'HighRequestCount') {
      console.log('Scaling up: Launching a new server container');
      await launchServerContainer();
    } else if (alert.labels.alertname === 'HighScaleRequestCount') {
      console.log('Scaling down: Terminating a server container');
      await terminateServerContainer();
    }
  });
  res.status(200).send('Alert received');
});

async function launchServerContainer() {
  await docker.container.create({
    Image: 'server',
    name: `server_${Date.now()}`,
    Env: [`PORT=3000`],
    HostConfig: {
      PortBindings: {
        '3000/tcp': [{}]
      }
    }
  }).start();
}

async function terminateServerContainer() {
  const containers = await docker.container.list({ filters: { name: ['server'] } });
  if (containers.length > 0) {
    await docker.container.remove(containers[0].Id, { force: true });
  }
}

app.listen(PORT, () => {
  console.log(`Scaler service is running on port ${PORT}`);
});