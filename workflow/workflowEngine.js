"use strict";

const reasoner=require("../reasoning/reasoner");
const context=require("../reasoning/contextEngine");

class WorkflowEngine{

run(input){

context.push(input);

const tasks=reasoner.analyze(input);

return{
input,
tasks,
history:context.all()
};

}

}

module.exports=new WorkflowEngine();
