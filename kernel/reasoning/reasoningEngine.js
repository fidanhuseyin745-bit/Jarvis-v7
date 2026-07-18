"use strict";

class ReasoningEngine{

think(plan,state){

const thoughts=[];

thoughts.push("🎯 Amaç: "+plan.goal);

for(const s of plan.steps){

thoughts.push("➡ "+s);

}

if(state&&state.lastError){

thoughts.push("⚠ Önceki hata: "+state.lastError);

}

thoughts.push("✅ Hazırım.");

return thoughts;

}

}

module.exports=new ReasoningEngine();
