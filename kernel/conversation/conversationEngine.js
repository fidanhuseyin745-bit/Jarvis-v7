"use strict";

const memory=require("./conversationMemory");

class ConversationEngine{

understand(text){

text=text.toLowerCase();

const last=memory.last(10);

if(text.includes("ilk video")){

const yt=last.find(x=>x.text.includes("youtube"));

if(yt){

return{

intent:"YOUTUBE_FIRST_VIDEO",

context:"youtube"

};

}

}

if(text.includes("devam et")){

return{

intent:"CONTINUE",

context:last[last.length-1]||null

};

}

if(text.includes("ne demiştim")){

return{

intent:"RECALL",

history:last

};

}

return null;

}

}

module.exports=new ConversationEngine();
