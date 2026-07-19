"use strict";

const learning=require("../learning/learningEngine");

class AutonomousCore{

status(){

const report=learning.report();

return{

healthy:report.accuracy>=70,

accuracy:report.accuracy,

success:report.success,

fail:report.fail

};

}

}


AutonomousCore.prototype.decide=function(){
const s=this.status();
if(s.healthy)return "continue";
return "repair";
};

module.exports=new AutonomousCore();
