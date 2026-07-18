"use strict";
const {execSync}=require("child_process");

function run(cmd){
 try{
   return execSync(cmd,{encoding:"utf8"}).trim();
 }catch(e){
   return e.message;
 }
}

module.exports={
 create(name){
   return run(`git checkout -b ${name}`);
 },
 switch(name){
   return run(`git checkout ${name}`);
 }
};
