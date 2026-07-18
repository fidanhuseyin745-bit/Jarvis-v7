'use strict';

const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const API_BASE = 'http://localhost:3000';
const API_KEY = 'jarvis-local-2026';
const WEBSERVER_DIR = path.join(process.cwd(), 'webserver');
const WEBSERVER_ENTRY = path.join(WEBSERVER_DIR, 'index.js');

const SOURCE_KEYWORDS = {
  youtube: ['youtube', 'video'],
  wikipedia: ['wikipedia', 'vikipedi'],
  github: ['github'],
  reddit: ['reddit'],
  stackoverflow: ['stackoverflow', 'stack overflow'],
  npm: ['npm paket', 'npm package'],
  news: ['haber', 'news'],
  weather: ['hava durumu', 'weather'],
  currency: ['doviz', 'döviz', 'kur', 'currency']
};

class WebAgent {

  constructor() {
    this.serverProcess = null;
  }

  async isServerUp() {
    try {
      await axios.get(API_BASE + '/', { timeout: 1500 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async ensureServer() {

    if (await this.isServerUp()) {
      return true;
    }

    if (!fs.existsSync(WEBSERVER_ENTRY)) {
      console.log('❌ webserver/index.js bulunamadı, web API başlatılamadı.');
      return false;
    }

    console.log('🌐 Web API başlatılıyor...');

    this.serverProcess = spawn('node', [WEBSERVER_ENTRY], {
      cwd: WEBSERVER_DIR,
      detached: true,
      stdio: 'ignore'
    });

    this.serverProcess.unref();

    const start = Date.now();

    while (Date.now() - start < 10000) {

      if (await this.isServerUp()) {
        console.log('✅ Web API hazır.');
        return true;
      }

      await new Promise(r => setTimeout(r, 500));

    }

    console.log('❌ Web API zamanında hazır olmadı.');
    return false;

  }

  detectSource(instruction) {

    const text = instruction.toLowerCase();

    for (const [source, keywords] of Object.entries(SOURCE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) {
        return source;
      }
    }

    return null;

  }

  stripKeywords(instruction, source) {

    let text = instruction;

    const genericWords = ['internette ara', 'internette araştır', "web'de araştır", 'web de arastir', 'webde ara'];

    for (const w of genericWords) {
      text = text.replace(new RegExp(w, 'gi'), '');
    }

    if (source && SOURCE_KEYWORDS[source]) {
      for (const kw of SOURCE_KEYWORDS[source]) {
        text = text.replace(new RegExp(kw, 'gi'), '');
      }
    }

    return text.trim();

  }

  async search(query) {

    const ready = await this.ensureServer();

    if (!ready) {
      return { success: false, error: 'Web API kullanılamıyor.', results: [] };
    }

    try {

      const response = await axios.get(API_BASE + '/search', {
        params: { q: query },
        headers: { 'x-api-key': API_KEY },
        timeout: 15000
      });

      if (!response.data || !response.data.success) {
        return { success: false, error: (response.data && response.data.error) || 'Bilinmeyen hata', results: [] };
      }

      return { success: true, error: null, results: response.data.results || [] };

    } catch (e) {
      return { success: false, error: e.message, results: [] };
    }

  }

  async searchSource(source, query) {

    const ready = await this.ensureServer();

    if (!ready) {
      return { success: false, error: 'Web API kullanılamıyor.', results: [] };
    }

    try {

      const response = await axios.get(API_BASE + '/api/' + source, {
        params: { q: query },
        headers: { 'x-api-key': API_KEY },
        timeout: 15000
      });

      if (!response.data || !response.data.success) {
        return { success: false, error: (response.data && response.data.error) || 'Bilinmeyen hata', results: [] };
      }

      return { success: true, error: null, results: response.data.results };

    } catch (e) {
      return { success: false, error: e.message, results: [] };
    }

  }

  async smartSearch(instruction) {

    const source = this.detectSource(instruction);
    const query = this.stripKeywords(instruction, source);

    if (!query) {
      return { success: false, error: 'Ne aramamı istediğini belirtmelisin.', results: [], source };
    }

    if (source) {
      const result = await this.searchSource(source, query);
      return Object.assign({ source }, result);
    }

    const result = await this.search(query);
    return Object.assign({ source: 'general' }, result);

  }

  formatResults(results) {

    if (!results) {
      return 'Sonuç bulunamadı.';
    }

    if (Array.isArray(results)) {

      if (results.length === 0) {
        return 'Sonuç bulunamadı.';
      }

      return results
        .map((r, i) => {

          if (typeof r === 'string') {
            return `${i + 1}. ${r}`;
          }

          const title = r.title || r.name || '';
          const url = r.url || r.link || '';
          const snippet = r.snippet || r.description || '';

          return `${i + 1}. ${title}\n   ${url}\n   ${snippet}`.trim();

        })
        .join('\n\n');

    }

    return JSON.stringify(results, null, 2);

  }

}

module.exports = WebAgent;
