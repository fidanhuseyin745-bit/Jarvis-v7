"use strict";

class Orchestrator{

constructor(){

this.agents={};

}

register(name,agent){

this.agents[name]=agent;

}

has(name){

return !!this.agents[name];

}

list(){

return Object.keys(this.agents);

}

async execute(name,...args){

if(!this.agents[name]){

throw new Error("Agent bulunamadı: "+name);

}

return await this.agents[name](...args);

}

}

module.exports=new Orchestrator();
