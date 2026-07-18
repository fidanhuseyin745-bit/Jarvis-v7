'use strict';

const fs=require('fs');

module.exports={

exists(file){
return fs.existsSync(file);
},

read(file){
return fs.readFileSync(file,'utf8');
},

write(file,data){
fs.writeFileSync(file,data);
}

};
