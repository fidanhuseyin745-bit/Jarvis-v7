'use strict';

const { execSync } = require('child_process');

module.exports = {

  name: "adb",

  description: "Android ADB kontrol plugini",

  run(command="devices"){

    try{

      switch(command){

        case "devices":
          console.log(execSync("adb devices",{encoding:"utf8"}));
          break;

        case "screenshot":
          execSync("adb shell screencap -p /sdcard/jarvis.png");
          execSync("adb pull /sdcard/jarvis.png");
          console.log("📸 Ekran görüntüsü alındı.");
          break;

        case "home":
          execSync("adb shell input keyevent 3");
          console.log("🏠 Ana ekran açıldı.");
          break;

        case "back":
          execSync("adb shell input keyevent 4");
          console.log("⬅️ Geri tuşu.");
          break;

        case "youtube":
          execSync("adb shell monkey -p com.google.android.youtube -c android.intent.category.LAUNCHER 1");
          console.log("▶️ YouTube açıldı.");
          break;

        case "whatsapp":
          execSync("adb shell monkey -p com.whatsapp -c android.intent.category.LAUNCHER 1");
          console.log("💬 WhatsApp açıldı.");
          break;

        case "tap":{
          const a=(arguments[1]||"500 1200").split(" ");
          execSync(`adb shell input tap ${a[0]} ${a[1]}`);
          console.log(`👆 Dokunuldu: ${a[0]} ${a[1]}`);
          break;
        }

        case "swipe":{
          const a=(arguments[1]||"500 1700 500 400").split(" ");
          execSync(`adb shell input swipe ${a[0]} ${a[1]} ${a[2]} ${a[3]}`);
          console.log("👉 Kaydırıldı.");
          break;
        }

        case "text":
          execSync("adb shell input text Merhaba");
          console.log("⌨️ Yazı yazıldı.");
          break;

        default:
          console.log("Komutlar: devices | screenshot | home | back");

      }

    }catch(e){

      console.log("❌ "+e.message);

    }

  }

};
