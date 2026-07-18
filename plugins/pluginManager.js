'use strict';

const fs = require('fs');
const path = require('path');
const pluginConfig = require('./plugins.json');

class PluginManager {

  constructor() {
    this.pluginDir = path.join(__dirname);
    this.plugins = {};
    this.load();
  }

  load() {

    const dirs = fs.readdirSync(this.pluginDir, { withFileTypes: true });

    for (const dir of dirs) {

      if (!dir.isDirectory()) continue;

      const pluginFile = path.join(this.pluginDir, dir.name, 'index.js');

      if (!fs.existsSync(pluginFile)) continue;

      try {

        this.plugins[dir.name] = require(pluginFile);

      } catch (e) {

        console.log(`❌ Plugin yüklenemedi: ${dir.name}`);

      }

    }

  }

  list() {

    return Object.keys(pluginConfig).map(name=>({
      name,
      enabled:pluginConfig[name].enabled,
      version:pluginConfig[name].version
    }));

  }

  has(name) {

    return !!this.plugins[name];

  }

  run(name, ...args) {

    if (!this.has(name)) {
      console.log("❌ Plugin bulunamadı.");
      return;
    }

    return this.plugins[name].run(...args);

  }

  info(name){

    if(!this.has(name)){
      console.log("❌ Plugin bulunamadı.");
      return;
    }

    const p=this.plugins[name];

    console.log("📦 "+p.name);
    console.log("📝 "+(p.description||"Açıklama yok"));

  }

  setEnabled(name, enabled){

    const fs=require('fs');

    if(!pluginConfig[name]){
      console.log("❌ Plugin bulunamadı.");
      return;
    }

    pluginConfig[name].enabled=enabled;

    fs.writeFileSync(
      require('path').join(__dirname,"plugins.json"),
      JSON.stringify(pluginConfig,null,2)
    );

    console.log(enabled ? "✅ Plugin etkinleştirildi." : "⛔ Plugin devre dışı bırakıldı.");

  }

}

module.exports = PluginManager;
