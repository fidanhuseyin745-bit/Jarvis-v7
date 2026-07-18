'use strict';

const fs=require('fs');
const path=require('path');
const {execSync}=require('child_process');

class Runner{

constructor(projects){
this.projects=projects;
}

run(){

const dir=this.projects.getCurrent();

const pkg=path.join(dir,'package.json');

if(fs.existsSync(pkg)){

const json=JSON.parse(fs.readFileSync(pkg));

if(json.dependencies?.express){

if(!fs.existsSync(path.join(dir,'node_modules'))){

console.log('📦 npm install');
execSync('npm install',{cwd:dir,stdio:'inherit'});

}

console.log('🚀 Express başlatılıyor...');
execSync('npm start',{cwd:dir,stdio:'inherit'});

return;

}

if(json.name==="jarvis-react"){

console.log("⚠ React projeleri şu an çalıştırılamaz.");
console.log("Yakında Vite desteği eklenecek.");
return;

}

}

console.log("⚠ Desteklenmeyen proje.");

}

}

module.exports=Runner;
