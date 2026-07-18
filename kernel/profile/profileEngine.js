"use strict";

class Profile{

constructor(){

this.user={

name:"Hüseyin",

project:"Jarvis-v7",

device:"Oppo A60",

os:"Android 16",

env:"Termux",

language:"Türkçe"

};

}

get(){

return this.user;

}

}

module.exports=new Profile();
