"use strict";

const fs=require("fs");

class MemoryEngine{

constructor(){

this.file="./data/memory/memory.json";

if(!fs.existsSync("./data/memory"))
fs.mkdirSync("./data/memory",{recursive:true});

if(!fs.existsSync(this.file))
fs.writeFileSync(this.file,JSON.stringify({
profile:{},
history:[],
facts:[]
},null,2));

}

load(){

return JSON.parse(fs.readFileSync(this.file));

}

save(data){

fs.writeFileSync(this.file,JSON.stringify(data,null,2));

}

remember(key,value){

const data=this.load();

data.profile[key]=value;

this.save(data);

}

recall(key){

return this.load().profile[key];

}

addHistory(input,result){

const data=this.load();

data.history.push({

time:Date.now(),

input,

result

});

if(data.history.length>100)
data.history.shift();

this.save(data);

}

history(){

return this.load().history;

}

addFact(fact){

const data=this.load();

if(!data.facts.includes(fact))
data.facts.push(fact);

this.save(data);

}

facts(){

return this.load().facts;

}

}

module.exports=new MemoryEngine();
