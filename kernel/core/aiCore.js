"use strict";

const planner=require("../planner/planner");
const reasoning=require("../reasoning/reasoningEngine");
const confidence=require("../confidence/confidenceEngine");
const adaptive=require("../adaptive/adaptiveEngine");
const reflection=require("../reflection/reflectionEngine");
const learning=require("../learning/learningEngine");
const goals=require("../goals/goalManager");
const memory=require("../memory/memoryEngine");

class AICore{

async run(input,state,decision,executor){

const plan=planner.plan(input);

const thoughts=reasoning.think(plan,state);

const trust=confidence.calculate(
decision.intent,
decision.agent
);

const result=await executor();

const ok=!String(result).startsWith("❌");

learning.learn(ok);

adaptive.record(
decision.agent,
ok
);

reflection.review(
input,
result
);

memory.addHistory(
input,
result
);

memory.remember(
"lastIntent",
decision.intent
);

memory.remember(
"lastAgent",
decision.agent
);

return{

success:ok,

trust,

plan,

thoughts,

result

};

}

}

module.exports=new AICore();
