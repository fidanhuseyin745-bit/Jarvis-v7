"use strict";

class GoalManager{

constructor(){

this.goals=[];

}

add(goal){

this.goals.push({

id:Date.now(),

goal,

status:"active",

created:new Date().toISOString()

});

}

finish(id){

const g=this.goals.find(x=>x.id===id);

if(g) g.status="done";

}

active(){

return this.goals.filter(x=>x.status==="active");

}

all(){

return this.goals;

}

clearDone(){

this.goals=this.goals.filter(x=>x.status!=="done");

}

}

module.exports=new GoalManager();
