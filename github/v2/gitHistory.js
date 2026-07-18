"use strict";

const { execSync } = require("child_process");

function run(cmd){
    try{
        return execSync(cmd,{encoding:"utf8"}).trim();
    }catch(e){
        return "";
    }
}

module.exports={

    history(limit=10){
        return run(`git log --oneline -${limit}`);
    }

};
