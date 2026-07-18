"use strict";

const executive=require("../executive/executiveV2");
const planner=require("../planner/planner");
const reasoning=require("../reasoning/reasoningEngine");
const reflection=require("../reflection/reflectionEngine");
const memory=require("../memory/memoryEngine");
const conversation=require("../conversation/conversationManager");
const learning=require("../learning/learningEngine");
const metrics=require("../metrics/metrics");
const queue=require("../queue/agentQueue");
const state=require("../state/aiState");

class BrainPipeline{

async run(input,ai){

state.set("mode","processing");

conversation.add("user",input);

learning.remember(input);

queue.add(input);

const plan=planner.plan(input);
const thoughts=reasoning.think(plan,state.all());
console.log("\n🧠 Düşünce Süreci");
thoughts.forEach(x=>console.log(x));
console.log("");
let result;

try{

result=await executive.process(input,ai);

metrics.ok();

}catch(e){

metrics.fail();

result="❌ "+e.message;

}

const review=reflection.review(input,result);
console.log("\n🪞 Öz Değerlendirme");
console.log("Başarılı:",review.ok);
console.log("");
memory.addHistory(input,result);

conversation.add("assistant",result);

queue.next();

state.set("mode","idle");

memory.remember("lastIntent",decision.intent);
memory.remember("lastAgent",decision.agent);
return result;

}

status(){

return{

state:state.all(),

metrics:metrics.stats(),

queue:queue.size(),

conversation:conversation.stats()

};

}

}

module.exports=new BrainPipeline();
