"use strict";

class ConversationMemory{

constructor(){

this.history=[];

this.limit=50;

}

add(role,text){

this.history.push({

time:Date.now(),

role,

text

});

if(this.history.length>this.limit){

this.history.shift();

}

}

last(n=5){

return this.history.slice(-n);

}

find(keyword){

keyword=keyword.toLowerCase();

return this.history.filter(x=>

x.text.toLowerCase().includes(keyword)

);

}

clear(){

this.history=[];

}

}

module.exports=new ConversationMemory();
