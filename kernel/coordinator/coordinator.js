"use strict";

class Coordinator{

constructor(){

this.agents={};

}

register(name,agent){

this.agents[name]=agent;

}

get(name){

return this.agents[name];

}

async execute(name,callback){

if(!this.agents[name]){

return{
success:false,
error:"Agent bulunamadı"
};

}

return await callback(this.agents[name]);

}

list(){

return Object.keys(this.agents);

}

}

module.exports=new Coordinator();
