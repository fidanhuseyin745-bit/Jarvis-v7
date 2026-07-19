"use strict";

const learning=require("../learning/learningEngine");
const adaptive=require("../adaptive/adaptiveEngine");
const reflection=require("../reflection/reflectionEngine");
const repair=require("../selfrepair/selfRepair");

class AutonomousCore{

check(){

const report=learning.report();

if(report.accuracy<70){

return repair.repair("Başarı oranı düşük");

}

return{

fixed:true,

message:"Sistem sağlıklı.",

accuracy:report.accuracy

};

}

}

module.exports=new AutonomousCore();
