"use strict";

class Resume{

constructor(){

this.lastTask=null;

}

save(task){

this.lastTask=task;

}

get(){

return this.lastTask;

}

}

module.exports=new Resume();
