"use strict";

class ConversationManager{

constructor(){

this.messages=[];

}

add(role,text){

this.messages.push({

role,

text,

time:Date.now()

});

if(this.messages.length>50){

this.messages.shift();

}

}

last(){

return this.messages[this.messages.length-1]||null;

}

history(limit=10){

return this.messages.slice(-limit);

}

clear(){

this.messages=[];

}

stats(){

return{

count:this.messages.length

};

}

}

module.exports=new ConversationManager();
