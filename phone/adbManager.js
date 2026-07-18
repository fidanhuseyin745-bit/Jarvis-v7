"use strict";

const {execSync}=require("child_process");

function run(cmd){

try{
return execSync(cmd,{encoding:"utf8"}).trim();
}catch(e){
return "";
}

}

class ADBManager{

start(){

run("adb start-server");
return true;

}

devices(){

return run("adb devices");

}

connected(){

const d=this.devices();

const lines=d.split("\n").slice(1);

return lines.some(x=>x.trim().endsWith("device"));

}

ensure(){

this.start();

if(this.connected()){

return true;

}

console.log("📱 Telefon bağlı değil.");

return false;

}

stop(){

run("adb kill-server");

}

}

module.exports=ADBManager;
