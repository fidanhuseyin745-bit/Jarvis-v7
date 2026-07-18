"use strict";

class AIState{

constructor(){

this.state={
mode:"idle",
agent:null,
task:null,
lastResult:null,
lastError:null,
thinking:false,
startedAt:null
};

}

set(key,value){

this.state[key]=value;

}

get(key){

return this.state[key];

}

all(){

return this.state;

}

reset(){

this.state.mode="idle";
this.state.agent=null;
this.state.task=null;
this.state.lastResult=null;
this.state.lastError=null;
this.state.thinking=false;
this.state.startedAt=null;

}

}

module.exports=new AIState();
