"use strict";

class EmotionEngine{

constructor(){

this.mode="neutral";

}

detect(text){

text=text.toLowerCase();

if(text.includes("teşekkür")||text.includes("sağol"))
this.mode="happy";

else if(text.includes("hata")||text.includes("olmuyor"))
this.mode="helpful";

else if(text.includes("acele")||text.includes("çabuk"))
this.mode="focused";

else
this.mode="neutral";

return this.mode;

}

prefix(){

switch(this.mode){

case "happy":
return "😊";

case "helpful":
return "🤝";

case "focused":
return "⚡";

default:
return "🤖";

}

}

respond(text){

return this.prefix()+" "+text;

}

}

module.exports=new EmotionEngine();
