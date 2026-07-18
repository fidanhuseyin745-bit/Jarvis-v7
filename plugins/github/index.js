'use strict';

const { execSync } = require('child_process');

module.exports = {

  name: "github",

  description: "GitHub yönetim plugini",

  run(command = "status") {

    try {

      switch(command){

        case "status":
          console.log(execSync("git status",{encoding:"utf8"}));
          break;

        case "pull":
          console.log(execSync("git pull",{encoding:"utf8"}));
          break;

        case "push":
          console.log(execSync("git push",{encoding:"utf8"}));
          break;

        case "branch":
          console.log(execSync("git branch",{encoding:"utf8"}));
          break;

        default:
          console.log("Komutlar: status | pull | push | branch");

      }

    } catch(e){

      console.log("❌ "+e.message);

    }

  }

};
