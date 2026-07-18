"use strict";

class ContextEngine{

constructor(){

this.history=[];

}

push(input){

this.history.push(input);

if(this.history.length>20){

this.history.shift();

}

}

last(){

return this.history[this.history.length-1]||"";

}

all(){

return this.history;

}

}

module.exports=new ContextEngine();
