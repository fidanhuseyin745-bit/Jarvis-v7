"use strict";

const state=require("../state/aiState");

class ThoughtEngine{

start(task){

state.set("thinking",true);
state.set("task",task);
state.set("startedAt",Date.now());

console.log("🧠 Düşünüyorum...");
console.log("📌 Görev:",task);

}

step(text){

console.log("💭",text);

}

finish(result){

state.set("thinking",false);
state.set("lastResult",result);

console.log("✅ Tamamlandı.");

}

error(err){

state.set("thinking",false);
state.set("lastError",err);

console.log("❌",err);

}

}

module.exports=new ThoughtEngine();
