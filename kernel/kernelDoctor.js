"use strict";

const workflow=require("../workflow/workflowEngine");
const decision=require("../workflow/decisionEngine");
const orchestrator=require("../orchestrator/register");

class KernelDoctor{

run(){

console.log("🧠 Kernel Doctor");

console.log("Workflow:",workflow?"OK":"FAIL");
console.log("Decision:",decision?"OK":"FAIL");
console.log("Agents:",orchestrator.list().join(", "));

}

}

module.exports=KernelDoctor;
