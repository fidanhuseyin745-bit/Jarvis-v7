"use strict";
const {execSync}=require("child_process");

module.exports={
 commit(msg="Jarvis Auto Commit"){
  try{
   return execSync(`git commit -m "${msg}"`,{encoding:"utf8"});
  }catch(e){
   return e.message;
  }
 }
};
