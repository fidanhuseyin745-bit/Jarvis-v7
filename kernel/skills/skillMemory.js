"use strict";

class SkillMemory{

constructor(){

this.skills={};

}

use(name){

this.skills[name]=(this.skills[name]||0)+1;

}

list(){

return this.skills;

}

}

module.exports=new SkillMemory();
