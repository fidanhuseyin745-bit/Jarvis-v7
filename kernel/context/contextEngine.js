"use strict";

class ContextEngine{

constructor(){

this.context={
app:null,
intent:null,
lastCommand:null
};

}

update(command,intent,app){

this.context.lastCommand=command;

if(intent) this.context.intent=intent;

if(app) this.context.app=app;

}

get(){

return this.context;

}

resolve(text){

text=text.toLowerCase();

if(text.includes("ilk video") && this.context.app==="youtube"){

return "youtube:firstVideo";

}

if(text.includes("müziği aç") && this.context.app==="spotify"){

return "spotify:resume";

}

return null;

}

}

module.exports=new ContextEngine();
