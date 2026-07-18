"use strict";

class Queue{

constructor(){

this.q=[];

}

add(x){

this.q.push(x);

}

next(){

return this.q.shift();

}

size(){

return this.q.length;

}

}

module.exports=new Queue();
