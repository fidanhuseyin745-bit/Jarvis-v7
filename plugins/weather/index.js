'use strict';

module.exports = {

  name: "weather",

  description: "Hava durumu örnek plugini",

  run(city = "İstanbul") {

    console.log(`🌤 Hava durumu plugini çalıştı.`);
    console.log(`📍 Şehir: ${city}`);

  }

};

