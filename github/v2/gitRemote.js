"use strict";
const {execSync}=require("child_process");

module.exports={
 list(){
  try{
   return execSync("git remote -v",{encoding:"utf8"});
  }catch(e){
   return e.message;
  }
 }
};
