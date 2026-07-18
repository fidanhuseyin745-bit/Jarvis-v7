"use strict";

const orchestrator=require("./orchestrator");

const PhoneAgent=require("../agents/phoneAgent");
const WebAgent=require("../agents/webAgent");
const ProjectBuilder=require("../agents/projectBuilder");

const phone=new PhoneAgent();
const web=new WebAgent();
const builder=new ProjectBuilder();

orchestrator.register(
"phone",
async(input,ai)=>{

return await phone.assist(input,ai);

}
);

orchestrator.register(
"web",
async(input,ai)=>{

return await web.smartSearch(input);

}
);

orchestrator.register(
"builder",
async(input,ai)=>{

return "🚧 Builder Engine henüz bağlı değil: "+input;

}
);

orchestrator.register(
"chat",
async(input)=>{

return input;

}
);

module.exports=orchestrator;
