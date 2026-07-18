"use strict";

class AutoFix{

retry(fn,max=2){

let last;

for(let i=0;i<max;i++){

try{

return fn();

}catch(e){

last=e;

}

}

throw last;

}

}

module.exports=new AutoFix();
