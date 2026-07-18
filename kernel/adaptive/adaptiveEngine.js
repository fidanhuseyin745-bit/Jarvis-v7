"use strict";

class AdaptiveEngine{

constructor(){

this.stats={};

}

record(agent,success){

if(!this.stats[agent]){

this.stats[agent]={
success:0,
fail:0
};

}

if(success){

this.stats[agent].success++;

}else{

this.stats[agent].fail++;

}

}

pick(candidates){

let best=candidates[0];

let score=-1;

for(const a of candidates){

const s=this.stats[a]||{success:0,fail:0};

const total=s.success+s.fail;

const rate=total===0?50:(s.success/total)*100;

if(rate>score){

score=rate;

best=a;

}

}

return best;

}

report(){

return this.stats;

}

}

module.exports=new AdaptiveEngine();
