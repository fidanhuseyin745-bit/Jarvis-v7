"use strict";

class DecisionEngine{

pick(tasks){

if(tasks.includes("PHONE")) return "phone";

if(tasks.includes("SEARCH")) return "web";

if(tasks.includes("BUILD")) return "builder";

if(tasks.includes("PLAN")) return "planner";

return "chat";

}

}

module.exports=new DecisionEngine();
