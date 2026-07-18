'use strict';

const {execSync}=require('child_process');
const path=require('path');

class Validator{

check(file){

const ext=path.extname(file);

try{

if(ext==='.js')
execSync(`node --check "${file}"`);

else if(ext==='.py')
execSync(`python3 -m py_compile "${file}"`);

return true;

}catch(e){

return false;

}

}

}

module.exports=Validator;
