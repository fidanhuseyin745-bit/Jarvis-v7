'use strict';

class Open{

constructor(projects){

this.projects=projects;

}

show(){

console.log(this.projects.getCurrent());

}

}

module.exports=Open;
