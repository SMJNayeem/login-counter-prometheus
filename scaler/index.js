const express = require('express');
const Docker = require('node-docker-api').Docker;
const fs = require('fs');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/alert', async (req, res) => {
  const alerts = req.body.alerts;
  for (const alert of alerts) {
    if (alert.labels.alertname === 'HighRequestCount') {
      console.log('Scaling up: Launching a new server container');
      await launchServerContainer();
    } else if (alert.labels.alertname === 'HighScaleRequestCount') {
      console.log('Scaling down: Terminating a server container');
      await terminateServerContainer();
    } else if (alert.labels.alertname === 'LogoutRequest') {
      console.log('Launching logout container...');
      await launchLogoutContainer();
    }
  }
  res.status(200).send('Alert received');
});

async function launchServerContainer() {
  const container = await docker.container.create({
    Image: 'server',
    name: `server_${Date.now()}`,
    Env: ['PORT=3000'],
    HostConfig: {
      PortBindings: {
        '3000/tcp': [{}]
      }
    }
  });
  await container.start();
  updateTargetsFile();
}

async function terminateServerContainer() {
  const containers = await docker.container.list({ filters: { name: ['server'] } });
  if (containers.length > 0) {
    await containers[0].stop();
    await containers[0].delete({ force: true });
    updateTargetsFile();
  }
}

async function updateTargetsFile() {
  const containers = await docker.container.list({ filters: { name: ['server'] } });
  const targets = containers.map(container => {
    const inspect = container.data;
    const ip = inspect.NetworkSettings.Networks['app-network'].IPAddress;
    return `${ip}:3000`;
  });

  const targetsData = JSON.stringify([{ targets }], null, 2);
  fs.writeFileSync('/etc/prometheus/targets/targets.json', targetsData);
}

async function launchLogoutContainer() {
  // Replace 'logout' with the actual image name for your logout functionality
  await docker.container.create({
    Image: 'logout',
    name: `logout_${Date.now()}`,
    // ... other container configuration options ...
  }).start();
}

app.listen(PORT, () => {
  console.log(`Scaler service is running on port ${PORT}`);
});
