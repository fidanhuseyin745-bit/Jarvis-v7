"use strict";
const {execSync}=require("child_process");

module.exports={
 fetch(){
  try{
   return execSync("git fetch",{encoding:"utf8"});
  }catch(e){
   return e.message;
  }
 }
};
