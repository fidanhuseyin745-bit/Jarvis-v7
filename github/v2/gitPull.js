"use strict";
const {execSync}=require("child_process");

module.exports={
 pull(){
  try{
   return execSync("git pull",{encoding:"utf8"});
  }catch(e){
   return e.message;
  }
 }
};
