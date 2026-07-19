"use strict";

const commander=require("../commander/aiCommander");
const reflection=require("../reflection/reflectionEngine");
const adaptive=require("../adaptive/adaptiveEngine");
const goals=require("../goals/goalManager");

class MasterBrain{

async run(cmd){

const out=await commander.run(cmd);

const review=reflection.review(out.result);

adaptive.record(
out.result.agent||"system",
review.ok
);

return{
commander:out,
review,
goals:goals.active()
};

}

}

module.exports=new MasterBrain();
