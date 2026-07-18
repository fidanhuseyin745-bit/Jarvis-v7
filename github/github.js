'use strict';

const {execSync}=require('child_process');

class Github{

push(project){

execSync('git add .',{cwd:project});
execSync('git commit -m "Jarvis Update"',{cwd:project});
console.log('✅ Commit hazır');

}

}

module.exports=Github;
