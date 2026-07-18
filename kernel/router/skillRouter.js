"use strict";

const intent=require("../intent/intentEngine");

class SkillRouter{

route(input){

const i=intent.detect(input);

const table={

OPEN_APP:"phone",

SEARCH:"web",

BUILD:"builder",

GIT:"git",

HELP:"chat",

CHAT:"chat"

};

return{

intent:i,

agent:table[i]||"chat"

};

}

}

module.exports=new SkillRouter();
