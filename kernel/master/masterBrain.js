"use strict";

const commander=require("../commander/aiCommander");
const reflection=require("../reflection/reflectionEngine");
const adaptive=require("../adaptive/adaptiveEngine");
const goals=require("../goals/goalManager");

class MasterBrain{

async run(cmd){

const output=await commander.run(cmd);

const review=reflection.review(output.result);

adaptive.record(
output.result.agent||"system",
review.ok
);

return{

output,
review,
goals:goals.active()

};

}

}

module.exports=new MasterBrain();
