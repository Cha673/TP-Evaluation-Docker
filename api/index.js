const express = require('express');
const os = require('os');
const client = require('prom-client'); 

const app = express();
const PORT = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Création du compteur personnalisé demandé pour la route principale
const requestCounter = new client.Counter({
  name: 'api_requests_total',
  help: 'Nombre total de requetes recues sur la route /',
});

// --- ROUTE 1 : GET / ---
app.get('/', (req, res) => {
  requestCounter.inc();

  const currentCount = requestCounter.hashMap[''].value;

  res.json({
    hostname: os.hostname(),
    PET: process.env.PET ,
    counter: currentCount
  });
});

// --- ROUTE 2 : GET /healthz (Pour le Healthcheck Docker) ---
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- ROUTE 3 : GET /metrics  ---
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(PORT, () => {
  console.log(`L'API Node écoute sur le port ${PORT}`);
});