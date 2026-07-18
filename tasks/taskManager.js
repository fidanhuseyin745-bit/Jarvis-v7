'use strict';

class TaskManager{

constructor(){

this.queue=[];

}

add(task){

this.queue.push(task);

}

next(){

return this.queue.shift();

}

}

module.exports=TaskManager;
