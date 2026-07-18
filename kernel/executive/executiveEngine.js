"use strict";

const brain=require("../brain/brainEngine");
const decision=require("../decision/decisionCore");
const scheduler=require("../scheduler/taskScheduler");

class ExecutiveEngine{

async execute(input){

const plan=brain.think(input);

const finalDecision=decision.decide(plan);

scheduler.start();

return{

plan,
decision:finalDecision

};

}

}

module.exports=new ExecutiveEngine();
