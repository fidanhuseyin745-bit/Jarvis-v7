"use strict";

const registry=require("./appRegistry");

function resolve(command){

command=command.toLowerCase();

for(const [name,app] of Object.entries(registry.apps)){

for(const alias of app.aliases){

if(command.includes(alias)){

return{

intent:"OPEN_APP",

app:name,

package:app.package

};

}

}

}

return null;

}

module.exports={resolve};
