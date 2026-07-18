'use strict';

const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cheerio = require('cheerio');

let providers = {};

try {
  providers = require('./providers/index');
} catch (e) {
  console.log('⚠️ providers/index.js yüklenemedi:', e.message);
}

const app = express();
const API_KEY = 'jarvis-local-2026';

app.use((req, res, next) => {
  if (req.path === '/') return next();
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
});

app.use(helmet());

app.use(rateLimit({
  windowMs: 60000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Jarvis Web API çalışıyor 🚀',
    availableSources: Object.keys(providers)
  });
});

app.get('/search', async (req, res) => {

  const q = req.query.q;

  if (!q) {
    return res.json({ success: false, error: 'query gerekli' });
  }

  try {

    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    const html = (await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).data;
    const $ = cheerio.load(html);

    let results = [];

    $('.result').each((i, e) => {
      if (i >= 5) return false;
      results.push({
        title: $(e).find('.result__title').text().trim(),
        url: $(e).find('a').attr('href'),
        snippet: $(e).find('.result__snippet').text().trim()
      });
    });

    res.json({ success: true, results });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }

});

app.get('/api/:source', async (req, res) => {

  const source = req.params.source;
  const q = req.query.q;

  if (!providers[source]) {
    return res.status(404).json({
      success: false,
      error: 'Bilinmeyen kaynak: ' + source,
      availableSources: Object.keys(providers)
    });
  }

  if (!q) {
    return res.json({ success: false, error: 'query gerekli' });
  }

  try {

    const provider = providers[source];
    let result;

    if (typeof provider === 'function') {
      result = await provider(q);
    } else if (provider && typeof provider.search === 'function') {
      result = await provider.search(q);
    } else if (provider && typeof provider.fetch === 'function') {
      result = await provider.fetch(q);
    } else if (provider && typeof provider.run === 'function') {
      result = await provider.run(q);
    } else {
      return res.status(500).json({ success: false, error: 'Provider çalıştırılabilir bir fonksiyon içermiyor: ' + source });
    }

    res.json({ success: true, source, results: result });

  } catch (err) {
    res.json({ success: false, source, error: err.message });
  }

});

app.listen(3000, () => {
  console.log('🌐 Jarvis Web API http://localhost:3000');
  console.log('📚 Kaynaklar: ' + Object.keys(providers).join(', '));
});
