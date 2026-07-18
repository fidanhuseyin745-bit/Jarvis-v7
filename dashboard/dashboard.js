"use strict";

const os=require("os");
const {execSync}=require("child_process");

class Dashboard{

run(){

const line="════════════════════════════════════════════";

console.clear();

console.log("╔"+line+"╗");
console.log("║            🤖 JARVIS DASHBOARD           ║");
console.log("╠"+line+"╣");

this.item("🟢 AI Engine","Online");
this.item("🌐 Web API","Online");
this.item("💾 Memory","Active");
this.item("🔌 Plugins","Loaded");

this.git();

this.item("🧠 RAM",Math.round(os.totalmem()/1024/1024)+" MB");

this.item("💻 CPU",os.cpus().length+" Cores");

console.log("╠"+line+"╣");
console.log("║        Jarvis hazır. Komut bekleniyor.   ║");
console.log("╚"+line+"╝");

}

item(a,b){

let left=(a+" ").padEnd(20);

console.log(`║ ${left}${String(b).padEnd(20)}║`);

}

git(){

try{

this.item("🌿 Branch",
execSync("git branch --show-current",{encoding:"utf8"}).trim());

}catch{}

try{

this.item("📝 Commit",
execSync("git log --oneline -1",{encoding:"utf8"}).trim());

}catch{}

}

}

module.exports=Dashboard;
