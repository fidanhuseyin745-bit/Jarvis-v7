"use strict";

class PersonalityEngine{

constructor(){

this.profile={

name:"Jarvis",

style:"friendly",

language:"tr",

emoji:true,

humor:true,

shortReplies:false

};

}

reply(text){

let prefix="";

if(this.profile.emoji){

prefix="🤖 ";

}

return prefix+text;

}

set(key,value){

this.profile[key]=value;

}

get(){

return this.profile;

}

}

module.exports=new PersonalityEngine();
