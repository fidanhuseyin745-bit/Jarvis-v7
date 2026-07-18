"use strict";

const state=require("../state/aiState");

class ReflectionEngine{

review(result){

const report={

ok:true,

score:100,

problems:[],

suggestions:[]

};

if(result===null||result===undefined){

report.ok=false;
report.score=0;
report.problems.push("Sonuç üretilemedi.");

}

if(typeof result==="string" && result.length<3){

report.score-=20;
report.suggestions.push("Daha açıklayıcı cevap üret.");

}

state.set("reflection",report);

return report;

}

}

module.exports=new ReflectionEngine();
