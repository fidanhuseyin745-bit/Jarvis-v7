'use strict';

const readline=require('node:readline/promises');
const {stdin,stdout}=require('node:process');

const ProjectManager=require('../project/manager');
const ProjectBuilder=require('../agents/projectBuilder');
const Runner=require('../commands/run');

class App{

constructor(){

this.projects=new ProjectManager();
this.builder=new ProjectBuilder(this.projects);
this.runner=new Runner(this.projects);

}

async start(){

const rl=readline.createInterface({
input:stdin,
output:stdout
});

console.log('🚀 Jarvis v6 Başladı');

while(true){

const cmd=await rl.question('Jarvis > ');

if(cmd==='çık') break;

try{

if(cmd==='çalıştır')
this.runner.run();
else
this.builder.build(cmd);

}catch(e){

console.log('❌',e.message);

}

}

rl.close();

}

}

module.exports=App;
