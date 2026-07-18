"use strict";

const state=require("../state/aiState");
const thought=require("../thought/thoughtEngine");
const router=require("../router/skillRouter");

class BrainEngine{

think(input){

thought.start(input);

const decision=router.route(input);

state.set("mode","thinking");
state.set("agent",decision.agent);
state.set("intent",decision.intent);

thought.step("Intent: "+decision.intent);
thought.step("Agent: "+decision.agent);

thought.finish("Decision Ready");

return decision;

}

}

module.exports=new BrainEngine();
