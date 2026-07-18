"use strict";

const fs=require("fs");
const {execSync}=require("child_process");
const os=require("os");

class Doctor{

 async run(){

  console.log("🩺 Jarvis Doctor\n");

  const checks=[
    ["Memory","memory"],
    ["Planner","planner"],
    ["Plugins","plugins"],
    ["GitHub","github"],
    ["WebServer","webserver"],
    ["Commands","commands"]
  ];

  for(const [name,path] of checks){

    if(fs.existsSync(path)){
      console.log("✅",name);
    }else{
      console.log("❌",name);
    }

  }

  

try{
 console.log("🟢 Node:",execSync("node -v",{encoding:"utf8"}).trim());
}catch{}



try{
 console.log("🌿 Branch:",execSync("git branch --show-current",{encoding:"utf8"}).trim());
}catch{}



try{
 console.log("📝 Commit:",execSync("git log --oneline -1",{encoding:"utf8"}).trim());
}catch{}



console.log("💾 RAM:",Math.round(os.totalmem()/1024/1024),"MB");

console.log("\n🎉 Kontrol tamamlandı.");





 }

}

module.exports=Doctor;
