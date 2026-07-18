"use strict";

const fs=require("fs");

class Loader{

load(){

if(!fs.existsSync("./plugins")) return [];

return fs.readdirSync("./plugins");

}

}

module.exports=new Loader();
