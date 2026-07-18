"use strict";

class TaskExecutor{

async execute(plan,callback){

const results=[];

for(const step of plan.steps){

console.log("➡",step);

const r=await callback(step);

results.push({
step,
result:r
});

}

return results;

}

}

module.exports=new TaskExecutor();
