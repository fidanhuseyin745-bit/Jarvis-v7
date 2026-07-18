"use strict";

const goals=require("../goal/goalManager");

class TaskScheduler{

constructor(){

this.running=false;

}

async start(worker){

if(this.running) return;

this.running=true;

while(true){

const goal=goals.next();

if(!goal) break;

console.log("🎯 Çalışıyor:",goal.title);

try{

await worker(goal);

goals.complete(goal.id);

console.log("✅ Bitti:",goal.title);

}catch(e){

console.log("❌ Hata:",e.message);

break;

}

}

this.running=false;

}

}

module.exports=new TaskScheduler();
