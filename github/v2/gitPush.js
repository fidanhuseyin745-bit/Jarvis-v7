"use strict";
const {execSync}=require("child_process");

module.exports={
 push(){
  try{
   return execSync("git push",{encoding:"utf8"});
  }catch(e){
   return e.message;
  }
 }
};
