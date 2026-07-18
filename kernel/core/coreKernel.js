"use strict";

const planner=require("../planner/planner");
const reasoning=require("../reasoning/reasoningEngine");
const goals=require("../goals/goalManager");
const adaptive=require("../adaptive/adaptiveEngine");
const confidence=require("../confidence/confidenceEngine");
const learning=require("../learning/learningEngine");
const reflection=require("../reflection/reflectionEngine");
const memory=require("../memory/memoryEngine");

class CoreKernel{

async process(input,state,decision){

const plan=planner.plan(input);

const thoughts=reasoning.think(plan,state);

const trust=confidence.calculate(
decision.intent,
decision.agent
);

return{

plan,
thoughts,
trust,
memory,
goals,
learning,
reflection,
adaptive

};

}

}

module.exports=new CoreKernel();
