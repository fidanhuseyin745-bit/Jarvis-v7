"use strict";

const memory=require("../memory/memoryCore");
const state=require("../state/aiState");

class DecisionCore{

decide(plan){

const mem=memory.export();

return{

agent:plan.agent,

intent:plan.intent,

confidence:0.95,

reason:

"Intent="+plan.intent+
" Agent="+plan.agent+
" History="+mem.history.length,

timestamp:Date.now()

};

}

}

module.exports=new DecisionCore();
