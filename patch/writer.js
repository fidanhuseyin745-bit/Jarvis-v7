'use strict';

const fs=require('fs');

class Writer{

replace(file,search,replace){

let text=fs.readFileSync(file,'utf8');

if(!text.includes(search))
return false;

text=text.replace(search,replace);

fs.writeFileSync(file,text);

return true;

}

appendAfter(file,search,content){

let text=fs.readFileSync(file,'utf8');

if(!text.includes(search))
return false;

text=text.replace(
search,
search+'\n'+content
);

fs.writeFileSync(file,text);

return true;

}

appendBefore(file,search,content){

let text=fs.readFileSync(file,'utf8');

if(!text.includes(search))
return false;

text=text.replace(
search,
content+'\n'+search
);

fs.writeFileSync(file,text);

return true;

}

}

module.exports=Writer;
