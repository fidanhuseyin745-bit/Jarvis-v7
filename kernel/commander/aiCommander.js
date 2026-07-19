"use strict";

const normalizer=require("../nlp/normalizer");
const context=require("../context/contextEngine");
const planner=require("../planner/planner");
const reasoning=require("../reasoning/reasoningEngine");
const executive=require("../executive/executiveV2");
const multi=require("../multiagent/multiAgentEngine");

class AICommander{

async run(input){

const text=normalizer.normalize(input);
const tasks=multi.split(text);

const ctx=context.resolve(text);

const plan=planner.plan(text);

const think=reasoning.think(plan,{});

const result=await executive.process(text);

return{

input,
normalized:text,
tasks,

context:ctx,
plan,
thinking:think,
result

};

}

}

module.exports=new AICommander();
