"use strict";

class ConfidenceEngine{

calculate(intent,agent){

let score=50;

if(intent) score+=20;

if(agent) score+=20;

if(agent==="phone") score+=5;
if(agent==="builder") score+=3;
if(agent==="web") score+=2;

if(score>100) score=100;

return score;

}

}

module.exports=new ConfidenceEngine();
