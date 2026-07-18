"use strict";

const fs=require("fs");
const path=require("path");

class PluginManager{

constructor(){

this.plugins=[];

}

load(){

const dir="./plugins";

if(!fs.existsSync(dir)) return;

for(const f of fs.readdirSync(dir)){

if(f.endsWith(".js")){

try{

const p=require(path.join(process.cwd(),"plugins",f));

this.plugins.push(p);

}catch(e){}

}

}

}

run(input){

for(const p of this.plugins){

if(p.match&&p.match(input))

return p.run(input);

}

return null;

}

count(){

return this.plugins.length;

}

}

module.exports=new PluginManager();
