"use strict";

class Context{

constructor(){

this.stack=[];

}

push(x){

this.stack.push(x);

if(this.stack.length>20){

this.stack.shift();

}

}

last(){

return this.stack[this.stack.length-1];

}

}

module.exports=new Context();
