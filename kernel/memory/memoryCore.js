"use strict";

class MemoryCore{

constructor(){

this.memory={

user:{},
projects:{},
history:[],
preferences:{}

};

}

remember(key,value){

this.memory.user[key]=value;

}

recall(key){

return this.memory.user[key];

}

addHistory(input,output){

this.memory.history.push({

time:new Date().toISOString(),

input,

output

});

if(this.memory.history.length>200){

this.memory.history.shift();

}

}

project(name,data){

this.memory.projects[name]=data;

}

preference(key,value){

this.memory.preferences[key]=value;

}

export(){

return this.memory;

}

}

module.exports=new MemoryCore();
