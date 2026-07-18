'use strict';

const fs=require('fs');

class History{

constructor(){

this.file='history.json';

if(!fs.existsSync(this.file))
fs.writeFileSync(this.file,'[]');

}

add(text){

const h=JSON.parse(fs.readFileSync(this.file));

h.push({
time:Date.now(),
text
});

while(h.length>100)
h.shift();

fs.writeFileSync(
this.file,
JSON.stringify(h,null,2)
);

}

last(){

const h=JSON.parse(fs.readFileSync(this.file));

return h[h.length-1];

}

all(){

return JSON.parse(fs.readFileSync(this.file));

}

}

module.exports=History;
