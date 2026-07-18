"use strict";

const brain=require("../brain/brainEngine");
const decision=require("../decision/decisionCore");
const emotion=require("../emotion/emotionEngine");
const memory=require("../memory/memoryCore");
const conversation=require("../conversation/conversationManager");
const orchestrator=require("../../orchestrator/register");

class ExecutiveV2{

async process(input,ai){

conversation.add("user",input);

emotion.detect(input);

const plan=brain.think(input);

const finalDecision=decision.decide(plan);

let result=null;

try{

result=await orchestrator.execute(
finalDecision.agent,
input,
ai
);

}catch(e){

result="❌ "+e.message;

}

memory.addHistory(input,result);

conversation.add("assistant",String(result));

return emotion.respond(
typeof result==="string"
?result
:"Görev tamamlandı."
);

}

}

module.exports=new ExecutiveV2();
