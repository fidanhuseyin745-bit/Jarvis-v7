'use strict';

const fs=require('fs');
const path=require('path');

class Backup{

create(file){

if(!fs.existsSync(file))
return null;

const backupDir=path.join(
path.dirname(file),
'.jarvis-backup'
);

fs.mkdirSync(backupDir,{recursive:true});

const stamp=Date.now();

const backupFile=path.join(
backupDir,
path.basename(file)+'.'+stamp+'.bak'
);

fs.copyFileSync(file,backupFile);

return backupFile;

}

restore(backup,file){

if(!backup) return false;

fs.copyFileSync(backup,file);

return true;

}

}

module.exports=Backup;
