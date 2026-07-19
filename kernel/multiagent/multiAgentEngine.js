"use strict";

class MultiAgentEngine{

split(command){

command=command.toLowerCase();

return command
.split(/\s+ve\s+/)
.map(x=>x.trim())
.filter(Boolean);

}

}

module.exports=new MultiAgentEngine();
