'use strict';

const fs=require('fs');

class Context{

constructor(){

this.file='context.json';

if(!fs.existsSync(this.file))
fs.writeFileSync(this.file,'{}');

}

get(){

return JSON.parse(fs.readFileSync(this.file));

}

set(key,value){

const c=this.get();

c[key]=value;

fs.writeFileSync(this.file,JSON.stringify(c,null,2));

}

}

module.exports=Context;
