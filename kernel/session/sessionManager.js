"use strict";

class SessionManager{

constructor(){

this.session={

id:Date.now().toString(),

started:new Date().toISOString(),

commands:0

};

}

touch(){

this.session.commands++;

}

info(){

return this.session;

}

}

module.exports=new SessionManager();
