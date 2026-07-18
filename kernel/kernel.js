"use strict";

const workflow=require("../workflow/workflowEngine");
const decision=require("../workflow/decisionEngine");
const orchestrator=require("../orchestrator/register");

class Kernel{

async run(input,ai){

const flow=workflow.run(input);

const agent=decision.pick(flow.tasks);

return await orchestrator.execute(
agent,
input,
ai
);

}

}

module.exports=new Kernel();
