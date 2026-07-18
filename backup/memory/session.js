'use strict';

const fs=require('fs');

class Session{

constructor(){

this.file='session.json';

if(!fs.existsSync(this.file))
fs.writeFileSync(this.file,'{}');

}

load(){

return JSON.parse(fs.readFileSync(this.file));

}

save(data){

fs.writeFileSync(this.file,JSON.stringify(data,null,2));

}

}

module.exports=Session;
