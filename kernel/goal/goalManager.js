"use strict";

class GoalManager{

constructor(){

this.goals=[];

}

add(title,priority=1){

const goal={
id:Date.now().toString(),
title,
priority,
status:"pending",
created:new Date().toISOString()
};

this.goals.push(goal);

this.sort();

return goal;

}

sort(){

this.goals.sort((a,b)=>b.priority-a.priority);

}

next(){

return this.goals.find(g=>g.status==="pending");

}

complete(id){

const g=this.goals.find(x=>x.id===id);

if(g) g.status="done";

}

remove(id){

this.goals=this.goals.filter(x=>x.id!==id);

}

list(){

return this.goals;

}

clear(){

this.goals=[];

}

}

module.exports=new GoalManager();
