'use strict';

const fs = require('fs');
const path = require('path');

class Finder {

find(root,fileName){

let result=null;

function walk(dir){

const files=fs.readdirSync(dir,{withFileTypes:true});

for(const file of files){

if(result) return;

const full=path.join(dir,file.name);

if(file.isDirectory()){

if(file.name==='node_modules') continue;
if(file.name==='.git') continue;

walk(full);

}else{

if(file.name===fileName){

result=full;
return;

}

}

}

}

walk(root);

return result;

}

}

module.exports=Finder;
