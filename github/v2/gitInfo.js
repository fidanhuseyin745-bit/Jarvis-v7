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

    repo(){
        return run("git remote -v");
    },

    branch(){
        return run("git branch");
    },

    status(){
        return run("git status --short");
    },

    log(){
        return run("git log --oneline -10");
    }

};
