"use strict";

const workflow=require("./workflowEngine");
const decision=require("./decisionEngine");

class Executor{

execute(input){

const data=workflow.run(input);

const agent=decision.pick(data.tasks);

return{
agent,
tasks:data.tasks,
history:data.history
};

}

}

module.exports=new Executor();
