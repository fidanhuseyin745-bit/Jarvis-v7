'use strict';

const {execSync}=require('child_process');

module.exports=function(dir,msg){

execSync(`git commit -m "${msg}"`,{
cwd:dir,
stdio:'inherit'
});

console.log('✅ Commit oluşturuldu');

}
