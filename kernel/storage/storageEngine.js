"use strict";

const fs=require("fs");

const FILE="./data/ai_memory.json";

class StorageEngine{

load(){

try{

if(!fs.existsSync(FILE)){

return {};

}

return JSON.parse(fs.readFileSync(FILE,"utf8"));

}catch{

return {};

}

}

save(data){

fs.mkdirSync("./data",{recursive:true});

fs.writeFileSync(
FILE,
JSON.stringify(data,null,2)
);

return true;

}

}

module.exports=new StorageEngine();
