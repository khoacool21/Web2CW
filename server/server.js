// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const https = require('https');
global.Vocab = require('./api/models/vocabModel');
const routes = require('./api/routes/vocabRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/vocab-builder', {
  useNewUrlParser: true
});

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.get('/postcode/:code', (req, res) => {
  const code = encodeURIComponent(String(req.params.code || '').trim());
  const options = {
    hostname: 'api.postcodes.io',
    path: `/postcodes/${code}`,
    method: 'GET',
    headers: { Accept: 'application/json' }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      try {
        const json = JSON.parse(data);
        res.status(response.statusCode || 200).json(json);
      } catch (e) {
        res.status(500).json({ error: 'Invalid JSON from postcode API' });
      }
    });
  });

  request.on('error', (err) => {
    res.status(502).json({ error: 'Upstream request failed', message: err.message });
  });

  request.end();
});

app.listen(port);
app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

console.log(`Server started on port ${port}`);
